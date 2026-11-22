# Crop Circle — Shopify theme

A custom Shopify theme for Crop Circle: glow-in-the-dark embroidery on a core range of
tees, long sleeves, hoodies, joggers and shorts. Customers pick a garment, choose a
thread colour (blue, green, red, white, pink, orange), place the logo, and preview the
glow with the lights on or off before adding to cart.

## What's in here

| Folder | What it does |
|---|---|
| `layout/` | Page shell (fonts, header, footer) |
| `sections/` | Building blocks you can edit in the Shopify theme editor: hero, core range, how it works, Catch the Glow game, FAQ, product designer, cart, etc. |
| `snippets/` | Shared pieces: garment drawings, thread colours, product card |
| `templates/` | Which sections appear on each page type |
| `assets/` | CSS, JavaScript and the Crop Circle logo |
| `setup/crop-circle-products.csv` | The 5 core products, ready to import |

## How ordering works

- **Garment** = a separate product (5 products).
- **Thread colour** and **Size** = product options, so every combination is a variant
  (6 colours × 5 sizes = 30 variants per product). You see the thread colour on every order and can
  track or turn off a colour if you run out of thread.
- **Logo position** and **Logo size** = saved on the order line (line item properties).
  They show in the cart, at checkout and on the order in Shopify admin, e.g.
  `Logo position: Right 12, Up 4` · `Logo size: 120%`.
  The numbers are slider steps from the default spot; centre/100% means the standard position.

The product page works out which garment drawing to show from the product type
(`Tee`, `Long sleeve tee`, `Hoodie`, `Joggers`, `Shorts`). To override it, set a product
metafield `custom.garment` to one of `tee`, `longsleeve`, `hoodie`, `joggers`, `shorts`.

## Setting up the store

1. **Upload the theme.** Either connect this GitHub repo in *Online Store → Themes → Add theme →
   Connect from GitHub*, or download the repo as a zip and use *Add theme → Upload zip file*.
   Preview it before publishing.
2. **Import products.** *Products → Import →* `setup/crop-circle-products.csv`.
   Placeholder prices: Tee £35, Long sleeve £40, Shorts £40, Joggers £55, Hoodie £65.
   Products are made to order, so stock isn't tracked and they never sell out.
3. **Add photos** to each product (optional). Until you do, the shop shows a glowing garment drawing.
4. **Create a collection** called "Core range" with the five products, then pick it in the
   theme editor for the *Core range* section (home page) and the *Product designer* section's
   garment picker. If you skip this, both use all products.
5. **Menus.** In *Online Store → Navigation*:
   - `main-menu`: Shop → `/collections/all`, How it works → `/#how`, Play → `/#play`, FAQ → `/#faq`, Contact → `/pages/contact`
   - `footer`: the same links, plus your policy pages
6. **Contact page.** *Online Store → Pages → Add page* titled "Contact", template `page.contact`.
7. **Footer.** In the theme editor, set the real email, Instagram and TikTok links.

## Placeholders to check before launch

- Prices (above)
- Contact email `hello@cropcircle.example`
- Announcement bar: "Free UK delivery over £75" — match your shipping settings or remove it
- Dispatch time "5–7 working days" (product page fine print + FAQ)
- FAQ answers on glow brightness and washing, which should match your thread supplier's guidance
- Thread colour swatch and glow shades: edit `snippets/thread-colour.liquid` **and**
  `THREAD_COLOURS` in `assets/crop-circle.js` (keep the two in step)

## Adding a thread colour

1. Add the colour as a value of the *Thread colour* option on each product.
2. Add a `when` line for it in `snippets/thread-colour.liquid` and a matching entry in
   `THREAD_COLOURS` in `assets/crop-circle.js`, with a daylight hex colour and a glow `r,g,b` value.
