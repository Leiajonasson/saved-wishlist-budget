// Product pages and images verified on 2026-11-19. Prices are snapshots, not live comparisons.
// Images are the stores' own product photos, hotlinked from each product page.
// ARKET and Komplett block hotlinking, so those photos are bundled locally instead.
import trojaImage from "@/assets/real-troja.jpg";
import halsdukImage from "@/assets/real-halsduk.jpg";
import horlurarImage from "@/assets/real-horlurar.avif";
export type CatalogProduct = {
  name: string; brand: string; store: string; price: number; priceKnown: boolean;
  url: string; image?: string;
};
export const PRODUCT_CATALOG: Record<string, CatalogProduct> = {
  jeans: {"name": "KLEAN svarta jeans", "brand": "Weekday", "store": "Zalando", "price": 679, "url": "https://www.zalando.se/weekday-klean-regular-straight-jeans-straight-leg-black-web22g068-q11.html", "priceKnown": true, "image": "/produkter/jeans.jpg"},
  troja: {"name": "Tröja i alpacka och ull", "brand": "ARKET", "store": "ARKET", "price": 990, "url": "https://www.arket.com/sv-se/product/alpaca-woolblendjumper-black-1248555003/", "priceKnown": true, "image": trojaImage},
  kappa: {"name": "KIA ullkappa, grå", "brand": "Weekday", "store": "Zalando", "price": 1526, "url": "https://www.zalando.se/weekday-coat-klassisk-kapparock-grey-web21u038-c12.html", "priceKnown": true, "image": "/produkter/kappa.jpg"},
  horlurar: {"name": "WH-CH520 hörlurar", "brand": "Sony", "store": "Komplett", "price": 390, "url": "https://www.komplett.se/product/1225298/tv-ljud-bild/horlurar-tillbehor/horlurar/sony-wh-ch520-traadlosa-horlurar-on-ear-svart", "priceKnown": true, "image": horlurarImage},
  ljus: {"name": "JÄMLIK vaniljljus, 40 tim", "brand": "IKEA", "store": "IKEA", "price": 29, "url": "https://www.ikea.com/se/sv/p/jaemlik-doftljus-i-glas-vanilj-ljusbeige-70502178/", "priceKnown": true, "image": "/produkter/ljus.jpg"},
  halsduk: {"name": "Triangelscarf i kashmir", "brand": "ARKET", "store": "ARKET", "price": 990, "url": "https://www.arket.com/sv-se/product/cashmere-scarf-black-1357104001/", "priceKnown": true, "image": halsdukImage},
  glas: {"name": "FJÄLLUGGLA glas, 4-pack", "brand": "IKEA", "store": "IKEA", "price": 149, "url": "https://www.ikea.com/se/sv/p/fjaelluggla-champagneglas-klarglas-10628722/", "priceKnown": true, "image": "/produkter/glas.jpg"},
  parfym: {"name": "Light Blue EdT, 25 ml", "brand": "Dolce & Gabbana", "store": "Lyko", "price": 0, "url": "https://lyko.com/sv/dolce-gabbana/dolce--gabbana-light-blue-eau-de-toilette-25ml", "priceKnown": false, "image": "/produkter/parfym.jpg"},
  vas: {"name": "POMP glasvas, 18 cm", "brand": "IKEA", "store": "IKEA", "price": 49, "url": "https://www.ikea.com/se/sv/p/pomp-vas-lykta-klarglas-80326537/", "priceKnown": true, "image": "/produkter/vas.jpg"},
  resvaska: {"name": "Soundbox kabinväska, 55 cm", "brand": "American Tourister", "store": "Booztlet", "price": 1274.25, "url": "https://www.booztlet.com/se/sv/american-tourister/soundbox-spinner-67-24-tsa-exp_32831507", "priceKnown": true, "image": "/produkter/resvaska.jpg"},
  solglas: {"name": "Original Wayfarer Classic", "brand": "Ray-Ban", "store": "Ray-Ban", "price": 0, "url": "https://www.ray-ban.com/sweden/sunglasses/RB2140original%20wayfarer%20classic-svart/805289126591", "priceKnown": false, "image": "/produkter/solglas.jpg"},
  skalar: {"name": "FÄRGKLAR skålar, 4-pack", "brand": "IKEA", "store": "IKEA", "price": 100, "url": "https://www.ikea.com/se/sv/p/faergklar-skal-ljusbla-10600426/", "priceKnown": true, "image": "/produkter/skalar.jpg"},
  kaffe: {"name": "Manual S kaffebryggare", "brand": "Moccamaster", "store": "Elgiganten", "price": 2499, "url": "https://www.elgiganten.se/product/hem-hushall-tradgard/kaffemaskiner-te/kaffebryggare/moccamaster-kaffebryggare-53721/614058", "priceKnown": true, "image": "/produkter/kaffe.jpg"},
  smink: {"name": "Lifter Gloss 007 Amber", "brand": "Maybelline", "store": "Lyko", "price": 0, "url": "https://lyko.com/sv/maybelline-new-york/maybelline-lifter-gloss-amber-7", "priceKnown": false, "image": "/produkter/smink.jpg"},
  hudvard: {"name": "Ascorbyl Glucoside 12%, 30 ml", "brand": "The Ordinary", "store": "Lyko", "price": 191, "url": "https://lyko.com/sv/the-ordinary/the-ordinary-ascorbyl-glucoside-solution-12--30ml", "priceKnown": true, "image": "/produkter/hudvard.jpg"},
  harvard: {"name": "Elvital Hyaluron Pure, 250 ml", "brand": "L’Oréal Paris", "store": "Lyko", "price": 0, "url": "https://lyko.com/sv/loreal-paris/l-or-al-paris-elvital-hyaluron-pure--purifying-shampoo-250-ml", "priceKnown": false, "image": "/produkter/harvard.jpg"},
  yogamatta: {"name": "4 mm yogamatta, Astro Dust", "brand": "Reebok", "store": "CDON", "price": 275, "url": "https://cdon.se/produkt/reebok-4mm-yogamatta-astro-dust-29913e70526a5263/", "priceKnown": true, "image": "/produkter/yogamatta.jpg"},
  adventsljusstake: {"name": "STRÅLA LED-ljusstake, röd", "brand": "IKEA", "store": "IKEA", "price": 349, "url": "https://www.ikea.com/se/sv/p/strala-led-ljusstake-trae-loev-roed-50633566/", "priceKnown": true, "image": "/produkter/adventsljusstake.jpg"},
  bok: {"name": "Polcirkeln (pocket)", "brand": "Liza Marklund", "store": "Bokus", "price": 89, "url": "https://www.bokus.com/bok/9789164207821/polcirkeln", "priceKnown": true, "image": "/produkter/bok.jpg"},
  blomkruka: {"name": "Kruka Rudy, Ø25 cm", "brand": "Plantagen", "store": "Plantagen", "price": 0, "url": "https://plantagen.se/se/p/kruka-rudy-o25-cm-terrakotta-9c702-9d2f2-5a1c3-b141e-542907", "priceKnown": false, "image": "/produkter/blomkruka.jpg"},
  powerbank: {"name": "PowerCore 10K powerbank", "brand": "Anker", "store": "CDON", "price": 0, "url": "https://cdon.se/produkt/anker-powercore-10k-powerbank-10000-mah-usb-c-poweriq-svart-16766960f6845aff/", "priceKnown": false, "image": "/produkter/powerbank.jpg"},
  solkram: {"name": "Sun Hydrating Sun Face Cream SPF50, 40 ml", "brand": "ACO", "store": "Apoteket", "price": 199, "url": "https://www.apoteket.se/produkt/aco-sun-hydrating-sun-face-cre-40-ml-tub-1579632/", "priceKnown": true, "image": "/produkter/solkram.jpg"},
  airfryer: {"name": "3000 Series Dual Basket NA352/00", "brand": "Philips", "store": "Power", "price": 0, "url": "https://www.power.se/koksapparater/stekning-och-kokning/airfryers-och-fritoser/airfryers/philips-3000-series-dual-basket-na35200-airfryer/p-3111517/", "priceKnown": false, "image": "/produkter/airfryer.jpg"},
  kuddfodral: {"name": "Harriet kuddfodral, 50x50 cm", "brand": "Svanefors", "store": "Åhléns", "price": 479, "url": "https://www.ahlens.se/produkter/inredning/harriet-kuddfodral-62805486-b082-48a0-a46c-8176c0afacd6", "priceKnown": true, "image": "/produkter/kuddfodral.jpg"},
  karaff: {"name": "Karaff Krås, 1 liter", "brand": "Created by Designtorget", "store": "Designtorget", "price": 0, "url": "https://designtorget.se/karaff-kras-1-liter/", "priceKnown": false, "image": "/produkter/karaff.jpg"},
  festklanning: {"name": "Chiffon dress", "brand": "Gina Tricot", "store": "Gina Tricot", "price": 0, "url": "https://www.ginatricot.com/se/klader/klanningarjumpsuits/langarmade-klanningar/chiffon-dress-286741039", "priceKnown": false, "image": "/produkter/festklanning.jpg"},
  ansiktskram: {"name": "Natural Moisturizing Factors + HA, 100 ml", "brand": "The Ordinary", "store": "KICKS", "price": 185, "url": "https://www.kicks.se/the-ordinary-natural-moisturizing-factors-ha-100-ml", "priceKnown": true, "image": "/produkter/ansiktskram.jpg"},
};

export const LEGACY_PRODUCT_KEYS: Record<string, string> = {
  "Svarta Jeans": "jeans", "Stickad tröja": "troja", "Ullkappa": "kappa", "Hörlurar": "horlurar",
  "Doftljus": "ljus", "Kashmirhalsduk": "halsduk", "Champagneglas": "glas", "Parfym": "parfym",
  "Keramikvas": "vas", "Resväska": "resvaska", "Solglasögon": "solglas", "Keramikskålar": "skalar",
  "Kaffebryggare": "kaffe", "Läppstift & rouge": "smink", "C-vitaminserum": "hudvard", "Schampo": "harvard",
  "Yogamatta": "yogamatta", "Adventsljusstake": "adventsljusstake", "Pocketbok": "bok", "Blomkruka": "blomkruka",
  "Powerbank": "powerbank", "Solkräm": "solkram", "Airfryer": "airfryer", "Kuddfodral": "kuddfodral",
  "Glaskaraff": "karaff", "Festklänning": "festklanning", "Ansiktskräm": "ansiktskram",
};
