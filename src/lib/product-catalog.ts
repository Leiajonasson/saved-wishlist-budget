import kappaImage from "@/assets/produkt-kappa.jpg.asset.json";
import ljusImage from "@/assets/produkt-ljus.jpg.asset.json";
import glasImage from "@/assets/produkt-glas.jpg.asset.json";
import parfymImage from "@/assets/produkt-parfym.jpg.asset.json";
import vasImage from "@/assets/produkt-vas.jpg.asset.json";
import resvaskaImage from "@/assets/produkt-resvaska.jpg.asset.json";
import skalarImage from "@/assets/produkt-skalar.jpg.asset.json";
import kaffeImage from "@/assets/produkt-kaffe.jpg.asset.json";
import sminkImage from "@/assets/produkt-smink.jpg.asset.json";
import hudvardImage from "@/assets/produkt-hudvard.jpg.asset.json";
import harvardImage from "@/assets/produkt-harvard.jpg.asset.json";

// Product pages verified on 2026-11-19. Prices are snapshots, not live comparisons.
export type CatalogProduct = {
  name: string; brand: string; store: string; price: number; priceKnown: boolean;
  url: string; image?: string;
};
export const PRODUCT_CATALOG: Record<string, CatalogProduct> = {
  jeans: {"name": "KLEAN svarta jeans", "brand": "Weekday", "store": "Zalando", "price": 679, "url": "https://www.zalando.se/weekday-klean-regular-straight-jeans-straight-leg-black-web22g068-q11.html", "priceKnown": true},
  troja: {"name": "Tröja i alpacka och ull", "brand": "ARKET", "store": "ARKET", "price": 990, "url": "https://www.arket.com/sv-se/product/alpaca-woolblendjumper-black-1248555003/", "priceKnown": true},
  kappa: {"name": "KIA ullkappa, grå", "brand": "Weekday", "store": "Zalando", "price": 1526, "url": "https://www.zalando.se/weekday-coat-klassisk-kapparock-grey-web21u038-c12.html", "priceKnown": true, "image": kappaImage.url},
  horlurar: {"name": "WH-CH520 hörlurar", "brand": "Sony", "store": "Komplett", "price": 390, "url": "https://www.komplett.se/product/1225298/tv-ljud-bild/horlurar-tillbehor/horlurar/sony-wh-ch520-traadlosa-horlurar-on-ear-svart", "priceKnown": true},
  ljus: {"name": "JÄMLIK vaniljljus, 40 tim", "brand": "IKEA", "store": "IKEA", "price": 29, "url": "https://www.ikea.com/se/sv/p/jaemlik-doftljus-i-glas-vanilj-ljusbeige-70502178/", "priceKnown": true, "image": ljusImage.url},
  halsduk: {"name": "Triangelscarf i kashmir", "brand": "ARKET", "store": "ARKET", "price": 990, "url": "https://www.arket.com/sv-se/product/cashmere-scarf-black-1357104001/", "priceKnown": true},
  glas: {"name": "FJÄLLUGGLA glas, 4-pack", "brand": "IKEA", "store": "IKEA", "price": 149, "url": "https://www.ikea.com/se/sv/p/fjaelluggla-champagneglas-klarglas-10628722/", "priceKnown": true, "image": glasImage.url},
  parfym: {"name": "Light Blue EdT, 25 ml", "brand": "Dolce & Gabbana", "store": "Lyko", "price": 0, "url": "https://lyko.com/sv/dolce-gabbana/dolce--gabbana-light-blue-eau-de-toilette-25ml", "priceKnown": false, "image": parfymImage.url},
  vas: {"name": "POMP glasvas, 18 cm", "brand": "IKEA", "store": "IKEA", "price": 49, "url": "https://www.ikea.com/se/sv/p/pomp-vas-lykta-klarglas-80326537/", "priceKnown": true, "image": vasImage.url},
  resvaska: {"name": "Soundbox kabinväska, 55 cm", "brand": "American Tourister", "store": "Booztlet", "price": 1274.25, "url": "https://www.booztlet.com/se/sv/american-tourister/soundbox-spinner-67-24-tsa-exp_32831507", "priceKnown": true, "image": resvaskaImage.url},
  solglas: {"name": "Original Wayfarer Classic", "brand": "Ray-Ban", "store": "Ray-Ban", "price": 0, "url": "https://www.ray-ban.com/sweden/sunglasses/RB2140original%20wayfarer%20classic-svart/805289126591", "priceKnown": false},
  skalar: {"name": "FÄRGKLAR skålar, 4-pack", "brand": "IKEA", "store": "IKEA", "price": 100, "url": "https://www.ikea.com/se/sv/p/faergklar-skal-ljusbla-10600426/", "priceKnown": true, "image": skalarImage.url},
  kaffe: {"name": "Manual S kaffebryggare", "brand": "Moccamaster", "store": "Elgiganten", "price": 2499, "url": "https://www.elgiganten.se/product/hem-hushall-tradgard/kaffemaskiner-te/kaffebryggare/moccamaster-kaffebryggare-53721/614058", "priceKnown": true, "image": kaffeImage.url},
  smink: {"name": "Lifter Gloss 007 Amber", "brand": "Maybelline", "store": "Lyko", "price": 0, "url": "https://lyko.com/sv/maybelline-new-york/maybelline-lifter-gloss-amber-7", "priceKnown": false, "image": sminkImage.url},
  hudvard: {"name": "Ascorbyl Glucoside 12%, 30 ml", "brand": "The Ordinary", "store": "Lyko", "price": 191, "url": "https://lyko.com/sv/the-ordinary/the-ordinary-ascorbyl-glucoside-solution-12--30ml", "priceKnown": true, "image": hudvardImage.url},
  harvard: {"name": "Elvital Hyaluron Pure, 250 ml", "brand": "L’Oréal Paris", "store": "Lyko", "price": 0, "url": "https://lyko.com/sv/loreal-paris/l-or-al-paris-elvital-hyaluron-pure--purifying-shampoo-250-ml", "priceKnown": false, "image": harvardImage.url},
};

export const LEGACY_PRODUCT_KEYS: Record<string, string> = {
  "Svarta Jeans": "jeans", "Stickad tröja": "troja", "Ullkappa": "kappa", "Hörlurar": "horlurar",
  "Doftljus": "ljus", "Kashmirhalsduk": "halsduk", "Champagneglas": "glas", "Parfym": "parfym",
  "Keramikvas": "vas", "Resväska": "resvaska", "Solglasögon": "solglas", "Keramikskålar": "skalar",
  "Kaffebryggare": "kaffe", "Läppstift & rouge": "smink", "C-vitaminserum": "hudvard", "Schampo": "harvard",
};
