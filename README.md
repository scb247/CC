# Crop Circle — Shopify theme

A custom Shopify theme for Crop Circle: glow-in-the-dark embroidery on a core range of
tees, long sleeves, hoodies, joggers and shorts. Customers pick a garment, choose a
thread colour (blue, green, red, white, pink, orange) and size, and preview the
glow with the lights on or off before adding to cart. The logo position is fixed:
left chest on tees, long sleeves and hoodies; left pocket area on joggers and shorts.

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
- **Logo position** is fixed by garment, so there's nothing extra on the order:
  left chest for tops, left pocket area for bottoms.

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
3. **Add your blank garment photos** (see *Product photos* below). Until you do, the shop shows a drawn garment.
4. **Create a collection** called "Core range" with the five products, then pick it in the
   theme editor for the *Core range* section (home page) and the *Product designer* section's
   garment picker. If you skip this, both use all products.
5. **Menus.** In *Online Store → Navigation*:
   - `main-menu`: Shop → `/collections/all`, How it works → `/#how`, Play → `/#play`, FAQ → `/#faq`, Contact → `/pages/contact`
   - `footer`: the same links, plus your policy pages
6. **Contact page.** *Online Store → Pages → Add page* titled "Contact", template `page.contact`.
7. **Footer.** In the theme editor, set the real email, Instagram and TikTok links.

## Product photos

Upload blank (un-embroidered) garment photos in **Shopify admin → Products → [product] → Media**
("Add media" / drag and drop). The **first** image is the one that matters:

- it replaces the drawn placeholder in the shop grid and in the product page preview;
- the theme lays the glowing Crop Circle logo over it on the left chest / left pocket, in the chosen
  thread colour, and dims the photo when the customer switches the lights off.

Any further images show as small thumbnails under the preview.

For the logo to land in the right place, shoot all five the same way:

- **Square** (e.g. 2000 × 2000 px), JPG or PNG
- Garment **flat or on a ghost mannequin, front facing**, centred, filling about 80% of the frame
- **Black garment on a dark grey / black background**, even lighting
- No logo already on the garment

If a photo is framed differently and the logo sits in the wrong spot, nudge it for that product
with metafields (Settings → Custom data → Products → Add definition, type *Integer*):
`custom.logo_x` and `custom.logo_y` (logo centre, % from the photo's left / top edge) and
`custom.logo_size` (logo width as % of the photo width). Defaults:

| Garment | x | y | size |
|---|---|---|---|
| Tee, long sleeve | 62 | 30 | 11 |
| Hoodie | 62 | 36 | 11 |
| Joggers | 63 | 18 | 9 |
| Shorts | 64 | 30 | 10 |

## Placeholders to check before launch

- Prices (above)
- Contact email `hello@cropcircle.example`
- Announcement bar: "Free UK delivery over £75" — match your shipping settings or remove it
- Dispatch time "5–7 working days" (product page fine print + FAQ)
- FAQ answers on glow brightness and washing, which should match your thread supplier's guidance
- Brand green is `--accent-rgb` at the top of `assets/crop-circle.css` (currently `57,255,107`)
- Thread colour swatch and glow shades: edit `snippets/thread-colour.liquid` **and**
  `THREAD_COLOURS` in `assets/crop-circle.js` (keep the two in step)

## Adding a thread colour

1. Add the colour as a value of the *Thread colour* option on each product.
2. Add a `when` line for it in `snippets/thread-colour.liquid` and a matching entry in
   `THREAD_COLOURS` in `assets/crop-circle.js`, with a daylight hex colour and a glow `r,g,b` value.
