import mongoose from "mongoose";
import * as dotenv from "dotenv";
import Property from "./models/properties.js";

dotenv.config();

// Global properties with multiple high-quality images (4-5 per property)
const sampleProperties = [
  // ========== NORTHERN EUROPE ==========
  {
    title: "Norwegian Fjord Cabin with Aurora Views",
    desc: "Experience the magic of Norway in this stunning wooden cabin perched above a pristine fjord. Watch the Northern Lights dance from your private hot tub, hike glacier trails, and enjoy the midnight sun. Authentic Scandinavian design meets modern comfort.",
    img: "https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?w=800",
    images: [
      "https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
      "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800",
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800"
    ],
    rating: 4.97,
    price: { org: 320, mrp: 400, off: 20 },
    amenities: [
      { icon: "wifi", name: "Starlink WiFi" },
      { icon: "hottub", name: "Private Hot Tub" },
      { icon: "fireplace", name: "Wood Fireplace" },
      { icon: "kitchen", name: "Full Kitchen" },
      { icon: "aurora", name: "Aurora Viewing" },
      { icon: "sauna", name: "Private Sauna" }
    ],
    host: {
      name: "Erik Larsen",
      image: "https://randomuser.me/api/portraits/men/71.jpg",
      joinedDate: new Date("2017-09-15"),
      isSuperhost: true
    },
    location: {
      address: "Fjordveien 42",
      city: "Tromsø",
      state: "Troms og Finnmark",
      country: "Norway",
      coordinates: { lat: 69.6489, lng: 18.9551 }
    },
    houseRules: [
      "No smoking inside",
      "Respect nature and wildlife",
      "Hot tub hours until 11 PM",
      "Firewood provided"
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "Entire cabin"
  },
  {
    title: "Swedish Forest Treehouse Escape",
    desc: "Reconnect with nature in this architectural marvel suspended among ancient Swedish pines. Floor-to-ceiling windows, minimalist Scandinavian design, and complete tranquility. Perfect for couples seeking a unique romantic getaway in the wilderness.",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    images: [
      "https://images.unsplash.com/photo-1618767689160-da3fb810aad7?w=800",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800",
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800"
    ],
    rating: 4.95,
    price: { org: 280, mrp: 350, off: 20 },
    amenities: [
      { icon: "wifi", name: "Free WiFi" },
      { icon: "breakfast", name: "Breakfast Basket" },
      { icon: "nature", name: "Forest Immersion" },
      { icon: "heating", name: "Underfloor Heating" },
      { icon: "eco", name: "Eco-Friendly" }
    ],
    host: {
      name: "Ingrid Bergström",
      image: "https://randomuser.me/api/portraits/women/72.jpg",
      joinedDate: new Date("2018-06-20"),
      isSuperhost: true
    },
    location: {
      address: "Skogsvägen 15",
      city: "Harads",
      state: "Norrbotten",
      country: "Sweden",
      coordinates: { lat: 66.0833, lng: 20.9667 }
    },
    houseRules: [
      "Adults only",
      "No smoking",
      "Respect forest silence",
      "Maximum 2 guests"
    ],
    checkInTime: "4:00 PM",
    checkOutTime: "10:00 AM",
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "Treehouse"
  },
  {
    title: "Finnish Lakeside Glass Igloo",
    desc: "Sleep under the stars and Northern Lights in this heated glass igloo on a frozen lake. Experience authentic Finnish sauna, ice swimming, and husky sledding. The ultimate Arctic adventure with all modern comforts.",
    img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
    images: [
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800"
    ],
    rating: 4.98,
    price: { org: 450, mrp: 550, off: 18 },
    amenities: [
      { icon: "wifi", name: "Free WiFi" },
      { icon: "sauna", name: "Finnish Sauna" },
      { icon: "aurora", name: "Aurora Alerts" },
      { icon: "breakfast", name: "Breakfast Included" },
      { icon: "heating", name: "Floor Heating" },
      { icon: "unique", name: "Glass Ceiling" }
    ],
    host: {
      name: "Matti Virtanen",
      image: "https://randomuser.me/api/portraits/men/73.jpg",
      joinedDate: new Date("2016-11-10"),
      isSuperhost: true
    },
    location: {
      address: "Iglookylä 1",
      city: "Rovaniemi",
      state: "Lapland",
      country: "Finland",
      coordinates: { lat: 66.5039, lng: 25.7294 }
    },
    houseRules: [
      "No smoking",
      "Quiet environment",
      "Sauna etiquette applies",
      "Check aurora forecast nightly"
    ],
    checkInTime: "4:00 PM",
    checkOutTime: "10:00 AM",
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "Glass igloo"
  },
  {
    title: "Copenhagen Canal House",
    desc: "Live like a local in this charming historic townhouse along the iconic Nyhavn canal. Colorful facades, cobblestone streets, and Danish hygge throughout. Walk to Tivoli Gardens, the Little Mermaid, and world-renowned restaurants.",
    img: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800",
    images: [
      "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800"
    ],
    rating: 4.89,
    price: { org: 240, mrp: 300, off: 20 },
    amenities: [
      { icon: "wifi", name: "High-Speed WiFi" },
      { icon: "kitchen", name: "Modern Kitchen" },
      { icon: "bicycle", name: "Free Bicycles" },
      { icon: "heating", name: "Central Heating" },
      { icon: "tv", name: "Smart TV" },
      { icon: "coffee", name: "Nespresso Machine" }
    ],
    host: {
      name: "Anders Nielsen",
      image: "https://randomuser.me/api/portraits/men/74.jpg",
      joinedDate: new Date("2019-03-25"),
      isSuperhost: true
    },
    location: {
      address: "Nyhavn 45",
      city: "Copenhagen",
      state: "Capital Region",
      country: "Denmark",
      coordinates: { lat: 55.6794, lng: 12.5900 }
    },
    houseRules: [
      "No smoking",
      "No parties",
      "Quiet hours after 10 PM",
      "Return bikes before 9 PM"
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    propertyType: "Entire townhouse"
  },
  {
    title: "Icelandic Geothermal Retreat",
    desc: "Discover the land of fire and ice from this stunning modern home with private geothermal hot spring. Watch geyser eruptions, explore volcanic landscapes, and soak under the midnight sun or Northern Lights. Truly otherworldly.",
    img: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800",
    images: [
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
    ],
    rating: 4.94,
    price: { org: 380, mrp: 480, off: 21 },
    amenities: [
      { icon: "wifi", name: "Starlink WiFi" },
      { icon: "hottub", name: "Geothermal Hot Spring" },
      { icon: "kitchen", name: "Full Kitchen" },
      { icon: "parking", name: "Free Parking" },
      { icon: "view", name: "Mountain Views" },
      { icon: "aurora", name: "Aurora Viewing" }
    ],
    host: {
      name: "Sigríður Jónsdóttir",
      image: "https://randomuser.me/api/portraits/women/75.jpg",
      joinedDate: new Date("2017-05-12"),
      isSuperhost: true
    },
    location: {
      address: "Geysir Road 22",
      city: "Golden Circle",
      state: "South Iceland",
      country: "Iceland",
      coordinates: { lat: 64.3104, lng: -20.3024 }
    },
    houseRules: [
      "Respect geothermal areas",
      "No smoking",
      "Close gates for sheep",
      "Check weather before hiking"
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "Entire house"
  },
  // ========== WESTERN EUROPE ==========
  {
    title: "Romantic Apartment near Eiffel Tower",
    desc: "Live the Parisian dream in this beautifully decorated apartment with stunning Eiffel Tower views. Classic Haussmann architecture, designer interiors, and a private balcony for morning coffee. Steps away from world-class restaurants and museums.",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
      "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    rating: 4.93,
    price: { org: 280, mrp: 350, off: 20 },
    amenities: [
      { icon: "wifi", name: "High-Speed WiFi" },
      { icon: "kitchen", name: "Gourmet Kitchen" },
      { icon: "view", name: "Eiffel Tower View" },
      { icon: "ac", name: "Air Conditioning" },
      { icon: "tv", name: "Smart TV" },
      { icon: "wine", name: "Wine Selection" }
    ],
    host: {
      name: "Sophie Laurent",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      joinedDate: new Date("2018-04-12"),
      isSuperhost: true
    },
    location: {
      address: "45 Avenue de la Bourdonnais",
      city: "Paris",
      state: "Île-de-France",
      country: "France",
      coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    houseRules: [
      "No smoking",
      "No parties",
      "Quiet hours after 10 PM",
      "Maximum 4 guests"
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    propertyType: "Entire apartment"
  },
  {
    title: "Santorini Cave House with Caldera View",
    desc: "Experience the magic of Santorini in this traditional cave house carved into the cliffs. Whitewashed walls, private terrace with infinity plunge pool, and unobstructed views of the caldera and legendary sunsets. Pure Greek island romance.",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
      "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800"
    ],
    rating: 4.98,
    price: { org: 450, mrp: 550, off: 18 },
    amenities: [
      { icon: "wifi", name: "Free WiFi" },
      { icon: "pool", name: "Private Plunge Pool" },
      { icon: "view", name: "Caldera View" },
      { icon: "ac", name: "Air Conditioning" },
      { icon: "kitchen", name: "Kitchenette" },
      { icon: "breakfast", name: "Breakfast Included" }
    ],
    host: {
      name: "Nikolaos Papadopoulos",
      image: "https://randomuser.me/api/portraits/men/42.jpg",
      joinedDate: new Date("2016-07-20"),
      isSuperhost: true
    },
    location: {
      address: "Oia Village",
      city: "Santorini",
      state: "South Aegean",
      country: "Greece",
      coordinates: { lat: 36.4618, lng: 25.3753 }
    },
    houseRules: [
      "No smoking indoors",
      "Adults only (18+)",
      "No parties",
      "Pool hours 8 AM - 10 PM"
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "Cave house"
  },
  {
    title: "Tuscan Villa with Vineyard Views",
    desc: "Escape to the rolling hills of Tuscany in this restored 17th-century villa. Surrounded by olive groves and vineyards, featuring a private pool, outdoor dining terrace, and authentic Italian charm. Wine tasting and cooking classes available.",
    img: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800",
    images: [
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800"
    ],
    rating: 4.96,
    price: { org: 380, mrp: 480, off: 21 },
    amenities: [
      { icon: "wifi", name: "Free WiFi" },
      { icon: "pool", name: "Private Pool" },
      { icon: "parking", name: "Free Parking" },
      { icon: "kitchen", name: "Chef's Kitchen" },
      { icon: "garden", name: "Olive Garden" },
      { icon: "wine", name: "Wine Cellar" },
      { icon: "bbq", name: "Outdoor BBQ" }
    ],
    host: {
      name: "Marco Bianchi",
      image: "https://randomuser.me/api/portraits/men/58.jpg",
      joinedDate: new Date("2017-03-15"),
      isSuperhost: true
    },
    location: {
      address: "Via delle Colline 42",
      city: "Chianti",
      state: "Tuscany",
      country: "Italy",
      coordinates: { lat: 43.4623, lng: 11.2558 }
    },
    houseRules: [
      "No smoking inside",
      "Pets welcome",
      "Respect quiet countryside",
      "Pool supervision for children"
    ],
    checkInTime: "4:00 PM",
    checkOutTime: "10:00 AM",
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 4,
    propertyType: "Entire villa"
  },
  // ========== AMERICAS ==========
  {
    title: "Manhattan Skyline Loft in NYC",
    desc: "Live like a New Yorker in this stunning industrial loft with floor-to-ceiling windows showcasing the Manhattan skyline. Exposed brick, designer furnishings, and rooftop access. Walking distance to Central Park and world-famous attractions.",
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
    ],
    rating: 4.87,
    price: { org: 320, mrp: 400, off: 20 },
    amenities: [
      { icon: "wifi", name: "Fiber WiFi" },
      { icon: "gym", name: "Building Gym" },
      { icon: "workspace", name: "Home Office" },
      { icon: "ac", name: "Central AC" },
      { icon: "tv", name: "75\" Smart TV" },
      { icon: "doorman", name: "24/7 Doorman" },
      { icon: "rooftop", name: "Rooftop Access" }
    ],
    host: {
      name: "Michael Chen",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      joinedDate: new Date("2019-09-01"),
      isSuperhost: true
    },
    location: {
      address: "350 West 42nd Street",
      city: "New York",
      state: "New York",
      country: "USA",
      coordinates: { lat: 40.7580, lng: -73.9855 }
    },
    houseRules: [
      "No smoking",
      "No pets",
      "No parties",
      "Quiet hours after 11 PM"
    ],
    checkInTime: "4:00 PM",
    checkOutTime: "11:00 AM",
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Entire loft"
  },
  {
    title: "Beachfront Paradise in Cancun",
    desc: "Your private slice of Caribbean paradise! This stunning beachfront villa features direct access to turquoise waters, a private infinity pool, outdoor jacuzzi, and full staff including chef. Perfect for celebrations and unforgettable vacations.",
    img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    rating: 4.94,
    price: { org: 550, mrp: 700, off: 21 },
    amenities: [
      { icon: "wifi", name: "High-Speed WiFi" },
      { icon: "pool", name: "Infinity Pool" },
      { icon: "beach", name: "Private Beach" },
      { icon: "chef", name: "Private Chef" },
      { icon: "jacuzzi", name: "Outdoor Jacuzzi" },
      { icon: "ac", name: "Air Conditioning" },
      { icon: "security", name: "24/7 Security" }
    ],
    host: {
      name: "Carlos Rodriguez",
      image: "https://randomuser.me/api/portraits/men/36.jpg",
      joinedDate: new Date("2017-11-22"),
      isSuperhost: true
    },
    location: {
      address: "Zona Hotelera Km 14",
      city: "Cancun",
      state: "Quintana Roo",
      country: "Mexico",
      coordinates: { lat: 21.1619, lng: -86.8515 }
    },
    houseRules: [
      "Respect the beach environment",
      "No outside guests after 10 PM",
      "Children must be supervised at pool",
      "No smoking indoors"
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "12:00 PM",
    maxGuests: 12,
    bedrooms: 6,
    bathrooms: 6,
    propertyType: "Entire villa"
  },
  // ========== AFRICA ==========
  {
    title: "Luxury Safari Lodge in Cape Town",
    desc: "Experience the best of South Africa from this stunning mountain lodge. Wake up to Table Mountain views, spot wildlife from your private deck, and enjoy world-class wines from nearby Stellenbosch. Adventure and luxury combined.",
    img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800",
    images: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800"
    ],
    rating: 4.95,
    price: { org: 420, mrp: 520, off: 19 },
    amenities: [
      { icon: "wifi", name: "Free WiFi" },
      { icon: "pool", name: "Infinity Pool" },
      { icon: "safari", name: "Safari Tours" },
      { icon: "fireplace", name: "Indoor Fireplace" },
      { icon: "kitchen", name: "Full Kitchen" },
      { icon: "wine", name: "Wine Tasting" },
      { icon: "view", name: "Mountain Views" }
    ],
    host: {
      name: "Thabo Ndlovu",
      image: "https://randomuser.me/api/portraits/men/48.jpg",
      joinedDate: new Date("2018-02-14"),
      isSuperhost: true
    },
    location: {
      address: "Constantia Valley Road",
      city: "Cape Town",
      state: "Western Cape",
      country: "South Africa",
      coordinates: { lat: -33.9249, lng: 18.4241 }
    },
    houseRules: [
      "No smoking inside",
      "Children welcome",
      "Pets not allowed",
      "Respect wildlife"
    ],
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 4,
    propertyType: "Entire lodge"
  },
  // ========== OCEANIA ==========
  {
    title: "Sydney Harbour Penthouse",
    desc: "Iconic Sydney living at its finest! This spectacular penthouse offers uninterrupted views of the Sydney Opera House and Harbour Bridge. Floor-to-ceiling glass, private rooftop terrace, and designer interiors. The ultimate Australian experience.",
    img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
    images: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"
    ],
    rating: 4.92,
    price: { org: 480, mrp: 600, off: 20 },
    amenities: [
      { icon: "wifi", name: "Premium WiFi" },
      { icon: "gym", name: "Private Gym" },
      { icon: "rooftop", name: "Rooftop Terrace" },
      { icon: "ac", name: "Climate Control" },
      { icon: "tv", name: "Home Theater" },
      { icon: "concierge", name: "Concierge" },
      { icon: "parking", name: "Secure Parking" }
    ],
    host: {
      name: "Emma Williams",
      image: "https://randomuser.me/api/portraits/women/56.jpg",
      joinedDate: new Date("2019-05-18"),
      isSuperhost: true
    },
    location: {
      address: "1 Circular Quay",
      city: "Sydney",
      state: "New South Wales",
      country: "Australia",
      coordinates: { lat: -33.8688, lng: 151.2093 }
    },
    houseRules: [
      "No smoking",
      "No parties",
      "No pets",
      "Quiet hours after 10 PM"
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "10:00 AM",
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    propertyType: "Entire penthouse"
  },
  {
    title: "Overwater Villa in Maldives",
    desc: "The ultimate tropical escape! This stunning overwater villa features a glass floor to watch marine life, private infinity pool merging with the ocean, outdoor shower, and butler service. Crystal-clear waters and pristine beaches await.",
    img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
    images: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800",
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"
    ],
    rating: 4.99,
    price: { org: 850, mrp: 1100, off: 23 },
    amenities: [
      { icon: "wifi", name: "Free WiFi" },
      { icon: "pool", name: "Private Infinity Pool" },
      { icon: "butler", name: "Personal Butler" },
      { icon: "spa", name: "In-Villa Spa" },
      { icon: "snorkel", name: "Snorkeling Gear" },
      { icon: "breakfast", name: "Floating Breakfast" },
      { icon: "sunset", name: "Sunset Views" }
    ],
    host: {
      name: "Ahmed Hassan",
      image: "https://randomuser.me/api/portraits/men/62.jpg",
      joinedDate: new Date("2016-12-01"),
      isSuperhost: true
    },
    location: {
      address: "North Malé Atoll",
      city: "Malé",
      state: "Kaafu Atoll",
      country: "Maldives",
      coordinates: { lat: 4.1755, lng: 73.5093 }
    },
    houseRules: [
      "No smoking",
      "Respect marine environment",
      "No coral collection",
      "Adults preferred"
    ],
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 PM",
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Overwater villa"
  },
  // ========== NEW ADDITIONS ==========
  {
    title: "Barcelona Gothic Quarter Penthouse",
    desc: "Live in the heart of Barcelona's historic Gothic Quarter in this stunning rooftop penthouse. Private terrace with panoramic city views, steps from La Rambla, and surrounded by tapas bars, boutiques, and Gaudí masterpieces. Mediterranean living at its finest.",
    img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
    images: [
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800"
    ],
    rating: 4.91,
    price: { org: 260, mrp: 320, off: 19 },
    amenities: [
      { icon: "wifi", name: "High-Speed WiFi" },
      { icon: "terrace", name: "Private Rooftop" },
      { icon: "ac", name: "Air Conditioning" },
      { icon: "kitchen", name: "Modern Kitchen" },
      { icon: "tv", name: "Smart TV" },
      { icon: "coffee", name: "Espresso Machine" }
    ],
    host: {
      name: "Maria García",
      image: "https://randomuser.me/api/portraits/women/82.jpg",
      joinedDate: new Date("2018-07-20"),
      isSuperhost: true
    },
    location: {
      address: "Carrer de la Pietat 8",
      city: "Barcelona",
      state: "Catalonia",
      country: "Spain",
      coordinates: { lat: 41.3851, lng: 2.1734 }
    },
    houseRules: [
      "No smoking",
      "Quiet hours after 11 PM",
      "No parties",
      "Respect neighbors"
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Entire penthouse"
  },
  {
    title: "Miami Beach Art Deco Villa",
    desc: "Experience the glamour of South Beach in this stunning Art Deco villa. Steps from the white sand beach, world-famous Ocean Drive, and Miami's best nightlife. Private pool, tropical garden, and iconic Miami style throughout.",
    img: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800",
    images: [
      "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
    ],
    rating: 4.88,
    price: { org: 420, mrp: 520, off: 19 },
    amenities: [
      { icon: "wifi", name: "High-Speed WiFi" },
      { icon: "pool", name: "Private Pool" },
      { icon: "beach", name: "Beach Access" },
      { icon: "ac", name: "Central AC" },
      { icon: "parking", name: "Private Parking" },
      { icon: "garden", name: "Tropical Garden" },
      { icon: "bbq", name: "Outdoor BBQ" }
    ],
    host: {
      name: "Ricardo Torres",
      image: "https://randomuser.me/api/portraits/men/83.jpg",
      joinedDate: new Date("2019-04-15"),
      isSuperhost: true
    },
    location: {
      address: "1420 Ocean Drive",
      city: "Miami Beach",
      state: "Florida",
      country: "USA",
      coordinates: { lat: 25.7825, lng: -80.1324 }
    },
    houseRules: [
      "No smoking indoors",
      "Pool hours 8 AM - 10 PM",
      "No parties without approval",
      "Pets allowed"
    ],
    checkInTime: "4:00 PM",
    checkOutTime: "11:00 AM",
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "Entire villa"
  },
  {
    title: "Seoul Hanok Traditional House",
    desc: "Experience authentic Korean culture in this beautifully restored traditional hanok in the historic Bukchon village. Ondol heated floors, courtyard garden, and stunning views of ancient palaces. Walk to vibrant Insadong and modern Gangnam.",
    img: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800",
    images: [
      "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800",
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"
    ],
    rating: 4.96,
    price: { org: 180, mrp: 230, off: 22 },
    amenities: [
      { icon: "wifi", name: "Free WiFi" },
      { icon: "heating", name: "Ondol Floor Heating" },
      { icon: "garden", name: "Courtyard Garden" },
      { icon: "kitchen", name: "Traditional Kitchen" },
      { icon: "tea", name: "Korean Tea Set" },
      { icon: "heritage", name: "Heritage Property" }
    ],
    host: {
      name: "Kim Min-jun",
      image: "https://randomuser.me/api/portraits/men/84.jpg",
      joinedDate: new Date("2017-11-08"),
      isSuperhost: true
    },
    location: {
      address: "32 Bukchon-ro 11-gil",
      city: "Seoul",
      state: "Seoul",
      country: "South Korea",
      coordinates: { lat: 37.5826, lng: 126.9831 }
    },
    houseRules: [
      "Shoes off inside",
      "No smoking",
      "Quiet hours after 10 PM",
      "Respect traditional architecture"
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    propertyType: "Entire hanok"
  }
];

const seedProperties = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB Atlas");

    // Delete all existing properties
    console.log("Removing all old properties...");
    const deleteResult = await Property.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} old properties`);

    // Insert new sample properties
    console.log("Adding new properties with multiple photos...");
    const insertResult = await Property.insertMany(sampleProperties);
    console.log(`Successfully added ${insertResult.length} new properties`);

    console.log("\n✅ Seed completed successfully!");
    console.log("New properties added:");
    insertResult.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.title} (${p.images.length} photos)`);
    });

    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding properties:", error);
    process.exit(1);
  }
};

seedProperties();
