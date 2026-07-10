# WISE Estímulos Cognitivos — Site Institucional

Site institucional de **Antonio Walesson Pereira de Castro**, psicólogo clínico (CRP 11/13625), especialista em saúde mental masculina. Atendimento online e presencial para adolescentes, adultos e idosos.

## 📁 Estrutura do projeto

```
/
├── index.html          → Página principal (site completo, single-file)
├── instagram.html       → Feed de posts do Instagram embutido no site
└── sitemap.xml          → Mapa do site para SEO
```

O `index.html` é **autocontido**: todo o CSS e JavaScript estão embutidos no próprio arquivo (nada de arquivos externos `.css` ou `.js`), incluindo as imagens usadas como capa de cards, que estão em base64 direto no HTML. Isso significa que o arquivo pode ser aberto ou hospedado em qualquer lugar sem depender de pastas adicionais.

## 🧩 Seções do `index.html`

| Seção | Âncora | Conteúdo |
|---|---|---|
| Hero | `#inicio` | Capa principal, chamada e CTA |
| Identificação | `#identificacao` | "Isso combina com você?" |
| Sobre | `#sobre` | Sobre o psicólogo |
| Serviços | `#servicos` | Modalidades de atendimento (adultos, idosos, online/presencial) |
| **Especialidades** | `#especialidades` | 15 cards com os principais temas atendidos (ansiedade, burnout, paternidade, autoestima, etc.), cada um com pop-up de detalhes ao clicar |
| Autoavaliação | `#autoavaliacao` | Quiz rápido de autoavaliação de saúde mental |
| FAQ | `#faq` | Perguntas frequentes |
| Histórias | `#historias` | Depoimentos |
| Blog | `#blog` | Artigos |
| Newsletter | — | Formulário de inscrição |
| Localização | `#localizacao` | Endereço/atendimento |

> A seção de Especialidades já foi um arquivo separado (`especialidades.html`) e foi incorporada ao `index.html` como uma seção interna, navegável pelo menu via âncora (`#especialidades`) — não é mais necessário hospedar um arquivo à parte.

## 🎨 Identidade visual

- **Cores:** petróleo (`#1C3A4A`), creme (`#F7F4EE`), sálvia (`#7A9E8E`), terracota (`#C4826A`)
- **Tipografia:** `DM Serif Display` (títulos) + `Inter` (texto)
- **Efeitos:** partículas neurais animadas em canvas, scroll reveal, tilt 3D nos cards, glassmorphism na navbar

## 🚀 Publicando o site (GitHub Pages)

1. Suba os arquivos (`index.html`, `instagram.html`, `sitemap.xml`) para a raiz do repositório.
2. Em **Settings → Pages**, selecione a branch principal como fonte.
3. Atualize o `sitemap.xml` trocando `SEU-USUARIO` pela URL real do site.

## 📝 Observações

- Todos os links de agendamento apontam para o WhatsApp: `https://wa.me/message/Z5P3WIFHEBGJJ1`
- O `sitemap.xml` enviado ainda contém uma URL placeholder (`SEU-USUARIO.github.io`) — ajustar antes de publicar.
- Não há dependências externas além das fontes do Google Fonts e imagens do Unsplash/base64 embutido.
