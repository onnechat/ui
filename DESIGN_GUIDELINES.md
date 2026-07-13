# Onne UI — guia de uso para agentes de IA

Cole (ou aponte) este arquivo para o Claude Design / qualquer ferramenta de IA
antes de gerar telas. Ele existe para resolver dois problemas recorrentes:

1. A IA constrói componentes na mão em vez de usar os que já existem.
2. A IA usa cores cruas (hex/rgb) em vez dos tokens do design system.

Regra de ouro: **componha a partir de `@onnechat/ui`. Nunca escreva HTML/estilo
cru quando existe um componente. Nunca use uma cor fora dos tokens.**

---

## 1. Use os componentes que já existem

Importe de `@onnechat/ui` (ou `@/components`). Se algo aqui resolve, **não crie
do zero**.

**Formulários & entradas:** `Input`, `Textarea`, `Select`, `SelectMulti`,
`SelectInfiniteScroll`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `Label`,
`InputGroup`, `InputCurrency`, `InputPhone`, `InputTime`/`InputTimePicker`,
`BrandDomainInput`, `LanguageSwitch`.

**Ações & navegação:** `Button`, `ButtonGroup`, `ActionGroup`, `DropdownMenu`,
`Command`, `Tabs`, `Breadcrumb`, `Kbd`, `Sidebar`.

**Superfícies & overlays:** `Card`, `Dialog`, `Drawer`, `Sheet`, `Popover`,
`GooeyPopover`, `HoverCard`, `Tooltip`, `Accordion`, `Collapsible`, `Alert`,
`Toast` (`ToastProvider` + `toast()`), `Separator`, `EmptyState`.

**Dados & feedback:** `Table`, `DataTable`, `Calendar`, `Progress`, `Skeleton`,
`Badge`, `Avatar`, `Loader`, `ShimmerText`, `Charts` (Area/Bar/Line/Pie/Tracker).

**Chat:** `Message` (+ `.Avatar/.Content/.Header/.Footer/.Group`), `Bubble`,
`Marker`, `Attachment`, `MessageScroller`, `TypingIndicator`, e o bloco pronto
`Chat` (`Blocks/Chat`).

**Layout de app:** `AppShell` (`Layouts/AppShell`) — moldura de dashboard com
sidebar(s). Use-o para telas internas em vez de montar header/sidebar na mão.

Para ícones use `<Icon name="…" />` (`@/components/icon`), nunca SVG solto.

---

## 2. Cores: só tokens, nunca hex

Use as classes utilitárias semânticas do Tailwind (mapeadas para os tokens do
tema). **Nunca** `bg-[#...]`, `text-white`, `bg-gray-100`, `style={{color}}`.

| Intenção | Classe | Nunca |
| --- | --- | --- |
| Fundo da página | `bg-background text-foreground` | `bg-white` |
| Superfície/cartão | `bg-card text-card-foreground` | `bg-gray-50` |
| Conteúdo sutil (dentro de card) | `bg-muted text-muted-foreground` | `bg-gray-100` |
| Realce/hover | `bg-accent text-accent-foreground` | `bg-gray-200` |
| Secundário | `bg-secondary text-secondary-foreground` | — |
| Ação primária (marca) | `bg-primary text-primary-foreground` | `bg-red-500` |
| Texto secundário | `text-muted-foreground` | `text-gray-500` |
| Borda/anel | `border-border`, `focus-visible:ring-ring` | `border-gray-200` |
| Campo | `bg-input` | — |
| Erro/perigo | `bg-destructive` / `text-destructive` | `text-red-600` |
| Sucesso · aviso · info | `bg-success` · `bg-warning` · `bg-info` | `bg-green-*` |
| Popover | `bg-popover text-popover-foreground` | — |
| Sidebar | `bg-sidebar text-sidebar-foreground` | — |

Regras:

- **Superfícies não usam borda visível** para se separar — a distinção é por
  cor de fundo (ex.: `Card` = `bg-card` sobre `bg-background`; miolo `bg-muted`).
  Reserve `border` para casos pontuais; prefira o contraste de superfície.
- Foco: `outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]`.
- Pares foreground: todo token de fundo tem seu `-foreground` (texto legível).
  Use sempre o par (`bg-primary` → `text-primary-foreground`).
- Para juntar classes condicionalmente use `cn()` de `@/lib/cn`.

---

## 3. Tamanhos e raios (consistência)

- Campos e botões compartilham a escala de altura: `size="sm"` (h-8/32px),
  `"default"` (h-10/40px), `"lg"` (h-12/48px). Um `Input lg` bate com um
  `Button lg`.
- Raios: superfícies externas `rounded-2xl` (16px), botões/campos `rounded-xl`
  (12px), ícones/avatares `rounded-lg` (8px).

---

## 4. Temas (portável entre produtos)

Os temas são **class-based** no `<html>`: `light` (padrão), `dark`, `cream`,
`claude`, `midnight`, `matrix`. Uma classe basta:

```html
<html class="midnight"> … </html>
```

Cada tema re-skina só as **superfícies**. A marca fica em `--primary`
(= `var(--brand-red)`), então **para rebrandar um produto inteiro** — em todos
os temas — basta sobrescrever a variável de marca no seu root:

```css
:root {
  --brand-red: oklch(63% 0.23 262.22); /* a marca do SEU produto */
}
```

Não hardcode a cor da marca nos componentes; deixe o token fazer o trabalho.

---

## 5. Checklist antes de entregar uma tela

- [ ] Todo elemento interativo é um componente da lib (0 HTML cru estilizado)?
- [ ] 0 cores hex/rgb/`*-gray-*`/`text-white` — só tokens semânticos?
- [ ] `bg-*` sempre com o `text-*-foreground` correspondente?
- [ ] Telas internas usam `AppShell`; conversas usam `Blocks/Chat`?
- [ ] Ícones via `<Icon />`?
