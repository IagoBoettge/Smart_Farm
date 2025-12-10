📌 Desafios Encontrados

Divisão entre estrutura e aparência

Foi necessário manter o HTML limpo, sem style="" inline, centralizando toda a estilização no styles.css.

Isso exigiu organização para não misturar responsabilidades e garantir a semântica correta do HTML.

Layout responsivo utilizando Grid e Flexbox

Para telas menores, media queries foram essenciais para reorganizar os elementos, transformando colunas em uma única pilha vertical.

Consistência visual entre seções

Manter harmonia de cores, fontes e espaçamentos foi desafiador, principalmente com diferentes tipos de blocos, como timeline, cards, chips e barras de progresso.

Implementação de animações e efeitos

Foram aplicados @keyframes, efeitos de hover e transições para suavizar interações (como a foto do perfil girando e os cards flutuando).

Ajustar a intensidade dos efeitos para não sobrecarregar o visual foi essencial.

Legibilidade e contraste do conteúdo

O contraste entre texto e fundo escuro precisou ser cuidadosamente calibrado, usando variáveis CSS (--accent, --muted) para manter acessibilidade.

🎯 Aprendizados Obtidos

Importância da documentação no código

O CSS incluía comentários e instruções passo a passo para cada seção, reforçando a prática de organizar tarefas em etapas menores.

Uso estratégico de variáveis CSS (:root)

Centralizar cores e estilos reutilizáveis proporcionou maior consistência e facilitou ajustes globais.

Controle avançado com Grid e Flexbox

Aprender a combinar grid (estrutura geral) e flexbox (alinhamento interno) mostrou como essas técnicas se complementam.

Design moderno com recursos simples

Gradientes, sombras e bordas suaves já proporcionam um visual sofisticado sem necessidade de frameworks externos.

Responsividade planejada desde o início

Breakpoints definidos para 968px e 640px garantiram boa usabilidade em dispositivos móveis.