const ESP32_IP = "http://10.135.182.1"; 
let sensorHistory = [];
let isUpdating = false;
let activeSection = "pg-inicio";


document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('backgroundMusic');
    
    // Tentar tocar automaticamente
    music.play().catch(() => {
        // Se falhar, tocar após qualquer interação
        document.addEventListener('click', () => {
            music.play();
        }, { once: true });
    });
});

function showSection(section) {
    activeSection = section;
    
    // Oculta tudo
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("charts").style.display = "none";
    document.getElementById("botoes").style.display = "none";
    document.getElementById("pg-inicio").style.display = "none";
    
    // Remove classe ativa de todos botões
    document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));

    // Mostra a seção desejada e ativa o botão
    if(section === 'pg-inicio') {
        document.getElementById("pg-inicio").style.display = "block";
        document.getElementById("btn-pg-inicio").classList.add("active");
    } else if (section === 'dashboard') {
        document.getElementById("dashboard").style.display = "grid"; // Importante para o CSS Grid
        document.getElementById("btn-dashboard").classList.add("active");
    } else if (section === 'charts') {
        document.getElementById("charts").style.display = "block";
        document.getElementById("btn-charts").classList.add("active");
        renderChart(); // Renderiza ao abrir a aba
    } else if (section === 'botoes') {
        document.getElementById("botoes").style.display = "block";
        document.getElementById("btn-botoes").classList.add("active");
    }
}

async function updateSensors() {
    if (isUpdating) return;
    isUpdating = true;
    try {

        //const data = { temperature: 25, humidity: 60, steam: 10, light: 2048, soil: 45, water: 80 }; 
        
        const res = await fetch(`${ESP32_IP}/sensors`);
        const data = await res.json();

        data.light = normalizeLight(data.light);

        renderSensors(data);
        addToHistory(data);

        if (activeSection === "charts") renderChart();
    } catch (e) {
        const errHtml = `<div style="grid-column: 1/-1; text-align:center; color:red; padding:20px;">
                            ❌ Falha na conexão com a Casa (ESP32)<br><small>${e.message}</small>
                         </div>`;
        document.getElementById("sensors").innerHTML = errHtml;
    } finally {
        isUpdating = false;
    }
}

function normalizeLight(raw) {

    let light = Math.pow(raw / 4095.0, 0.6) * 100.0;
    light = Math.round(light / 10) * 10;
    return Math.min(100, Math.max(0, light));
}

function renderSensors(data) {
    const sensores = [
        { nome: "🌡️ Temperatura", valor: data.temperature, unidade: "°C" },
        { nome: "☂️ Umidade Ar", valor: data.humidity, unidade: "%" },
        { nome: "🌦️ Vapor/Chuva", valor: data.steam, unidade: "%" },
        { nome: "🔆 Luz Solar", valor: data.light, unidade: "%" },
        { nome: "🌵 Umidade Solo", valor: data.soil, unidade: "%" },
        { nome: "🫗 Nível Água", valor: data.water, unidade: "%" },
    ];
    
    let html = "";
    sensores.forEach(s => {
        const val = Math.max(0, Math.min(100, s.valor)); 
            html += `
    <div class="sensor">
        <div class="label">
            <span>${s.nome}</span>
            <span style="color:var(--primary-color); font-weight:bold;">${val}${s.unidade}</span>
        </div>
        <div class="bar">
            <div class="bar-fill" style="width:${val}%;"></div>
        </div>
    </div>`;
    });
    
    
    const dashboard = document.getElementById("dashboard");

    let sensorsContainer = document.getElementById("sensors");

    if(!sensorsContainer) {
        sensorsContainer = document.createElement("div");
        sensorsContainer.id = "sensors";
        sensorsContainer.style.display = "contents"; 
        dashboard.appendChild(sensorsContainer);
    }
    sensorsContainer.innerHTML = html;
}

function addToHistory(data) {
    if (sensorHistory.length > 60) sensorHistory.shift();
    sensorHistory.push({
        temp: data.temperature,
        humidity: data.humidity,
        steam: data.steam,
        light: data.light,
        soil: data.soil,
        water: data.water
    });
}

function renderChart() {
    const canvas = document.getElementById("chartCanvas");
    if(!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const width = canvas.width, height = canvas.height, margin = 50;
    const graphWidth = width - 2 * margin, graphHeight = height - 2 * margin;
    
    ctx.clearRect(0, 0, width, height);

    // Grade (Grid)
    ctx.strokeStyle = "#eee"; // Mais suave
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = margin + (graphHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
    }

    // Eixos
    ctx.strokeStyle = "#666";
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();

    // Labels Y
    ctx.fillStyle = "#666";
    ctx.font = "12px Poppins"; 
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
        const val = 100 - i * 20;
        const y = margin + (graphHeight / 5) * i;
        ctx.fillText(val + "%", margin - 10, y + 4);
    }

    // Label X
    ctx.textAlign = "center";
    ctx.fillText("Tempo (Amostras)", width / 2, height - 10);
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("Valor (%)", -height / 2, 15);
    ctx.restore();

    const colors = {
        temp: "#e53935",
        humidity: "#1e88e5",
        steam: "#6a1b9a",
        light: "#FFD600",
        soil: "#43a047",
        water: "#00acc1"
    };
    
    for (const [key, color] of Object.entries(colors)) {
       
        if(sensorHistory.length > 0 && sensorHistory[0][key] !== undefined){
            const data = sensorHistory.map(d => d[key]);
            drawLine(ctx, data, color, graphWidth, graphHeight, margin, width, height);
        }
    }
}

function drawLine(ctx, data, color, graphWidth, graphHeight, margin, width, height) {
    if(data.length < 1) return;
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    data.forEach((val, i) => {
        const x = margin + (i / Math.max(data.length - 1, 1)) * graphWidth;
        const y = height - margin - (val / 100) * graphHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = color;
    data.forEach((val, i) => {
        const x = margin + (i / Math.max(data.length - 1, 1)) * graphWidth;
        const y = height - margin - (val / 100) * graphHeight;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI); 
        ctx.fill();
    });
}

async function sendCmd(cmd) {
    console.log("Enviando comando:", cmd);
    const btn = document.querySelector(`.control-btn.${cmd.toLowerCase()}`);
    if(btn) {
        const originalText = btn.innerText;
        btn.innerText = "Enviando...";
        setTimeout(() => btn.innerText = originalText, 500);
    }

    try { 
        await fetch(`${ESP32_IP}/actuator?cmd=${cmd}`); 
    } catch (e) { 
        console.warn("Erro ao enviar comando:", e); 
    }
}


setInterval(updateSensors, 2000);
updateSensors();