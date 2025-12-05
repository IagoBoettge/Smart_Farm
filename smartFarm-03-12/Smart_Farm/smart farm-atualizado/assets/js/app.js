
const ESP32_IP = "http://10.135.182.1";
let sensorHistory = [];
let isUpdating = false;
let activeSection = "pg-inicio";

// alternar entre painel e gráficos
function showSection(section) {
    activeSection = section;
    document.getElementById("dashboard").style.display = section === "dashboard" ? "block" : "none";
    document.getElementById("charts").style.display = section === "charts" ? "block" : "none";
    document.getElementById("botoes").style.display = section === "botoes" ? "block" : "none";
    document.getElementById("btn-dashboard").classList.toggle("active", section === "dashboard");
    document.getElementById("btn-charts").classList.toggle("active", section === "charts");
    document.getElementById("btn-botoes").classList.toggle("active", section === "botoes");
    document.getElementById("botoes").style.display = section === "botoes" ? "block" : "none";
    document.getElementById("btn-dashboard").classList.toggle("active", section === "dashboard");
    document.getElementById("pg-inicio").style.display = section === "pg-inicio" ? "block" : "none";
    document.getElementById("btn-pg-inicio").classList.toggle("active", section === "pg-inicio");
}

// atualização dos sensores
async function updateSensors() {
    if (isUpdating) return;
    isUpdating = true;
    try {
        const res = await fetch(`${ESP32_IP}/sensors`);
        const data = await res.json();

        // aplica fracionamento de luminosidade
        data.light = normalizeLight(data.light);

        renderSensors(data);
        addToHistory(data);

        if (activeSection === "charts") renderChart();
    } catch {
        document.getElementById("sensors").innerText = "❌ Erro ao conectar com ESP32";
    } finally {
        isUpdating = false;
    }
}

// normalização e fracionamento da luminosidade (10%, 20%, 30%...)
function normalizeLight(raw) {
    let light = Math.pow(raw / 4095.0, 0.6) * 100.0; // curva exponencial
    light = Math.round(light / 10) * 10; // arredonda em blocos de 10%
    return Math.min(100, Math.max(0, light));
}

// renderiza sensores na tela principal
function renderSensors(data) {
    const sensores = [
        { nome: "🌡️ Temperatura", valor: data.temperature, unidade: "°C" },
        { nome: "💧 Umidade", valor: data.humidity, unidade: "%" },
        { nome: "🌦️ Vapor/Chuva", valor: data.steam, unidade: "%" },
        { nome: "💡 Luz Ambiente", valor: data.light, unidade: "%" },
        { nome: "🌱 Umidade do Solo", valor: data.soil, unidade: "%" },
        { nome: "🚰 Nível da Água", valor: data.water, unidade: "%" },
    ];
    let html = "";
    sensores.forEach(s => {
        const val = Math.max(0, Math.min(100, s.valor));
        html += `
          <div class="sensor">
            <div class="label"><span>${s.nome}</span><span>${val}${s.unidade}</span></div>
            <div class="bar"><div class="bar-fill" style="width:${val}%;"></div></div>
          </div>`;
    });
    document.getElementById("sensors").innerHTML = html;
}

// histórico dos dados
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

// renderiza gráficos
function renderChart() {
    const canvas = document.getElementById("chartCanvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width, height = canvas.height, margin = 50;
    const graphWidth = width - 2 * margin, graphHeight = height - 2 * margin;
    ctx.clearRect(0, 0, width, height);

    // grade
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = margin + (graphHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
    }

    // eixos
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();

    // labels Y
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
        const val = 100 - i * 20;
        const y = margin + (graphHeight / 5) * i;
        ctx.fillText(val + "%", margin - 10, y + 4);
    }

    // label X
    ctx.textAlign = "center";
    ctx.fillText("Amostras (tempo)", width / 2, height - 10);
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("Percentual (%)", -height / 2, 15);
    ctx.restore();

    // linhas coloridas
    const colors = {
        temp: "#e53935",
        humidity: "#1e88e5",
        steam: "#6a1b9a",
        light: "#FFD600",
        soil: "#43a047",
        water: "#00acc1"
    };
    for (const [key, color] of Object.entries(colors)) {
        const data = sensorHistory.map(d => d[key]);
        drawLine(ctx, data, color, graphWidth, graphHeight, margin, width, height);
    }
}

// desenha linhas
function drawLine(ctx, data, color, graphWidth, graphHeight, margin, width, height) {
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
        ctx.arc(x, y, 2.3, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// comandos atuadores
async function sendCmd(cmd) {
    try { await fetch(`${ESP32_IP}/actuator?cmd=${cmd}`); }
    catch { console.warn("Erro ao enviar comando"); }
}

// atualização automática
setInterval(updateSensors, 2000);
updateSensors();