
export const Hotels= [
    {
      "id": 1,
      "name": "Grand Palace Hotel",
      "description": "A luxurious 5-star hotel in the heart of the city, featuring elegant rooms with panoramic city views, world-class dining, and exceptional service.",
      "category": "luxury",
      "rating": 4.8,
      "price_per_night": 350,
      "currency": "USD",
      "address": "123 Grand Avenue, Downtown",
      "city": "New York",
      "country": "USA",
      "latitude": 40.7589,
      "longitude": -73.9851,
      "phone": "+1-555-0123",
      "email": "info@grandpalacehotel.com",
      "website": "https://grandpalacehotel.com",
      "images": [
        "/assets/image-11.avif",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": true,
        "gym": true,
        "spa": true,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": true,
        "business_center": true,
        "pet_friendly": false,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Standard Room",
          "price": 350,
          "capacity": 2,
          "size": "35 sqm"
        },
        {
          "type": "Deluxe Suite",
          "price": 550,
          "capacity": 4,
          "size": "65 sqm"
        },
        {
          "type": "Presidential Suite",
          "price": 1200,
          "capacity": 6,
          "size": "120 sqm"
        }
      ],
      "check_in": "15:00",
      "check_out": "11:00",
      "languages": ["English", "Spanish", "French"],
      "payment_methods": ["Credit Card", "Cash", "PayPal"],
      "cancellation_policy": "Free cancellation up to 24 hours before check-in"
    },
    {
      "id": 2,
      "name": "Seaside Resort & Spa",
      "description": "Beachfront luxury resort with private beach access, multiple dining options, and world-class spa facilities. Perfect for romantic getaways and family vacations.",
      "category": "resort",
      "rating": 4.6,
      "price_per_night": 280,
      "currency": "USD",
      "address": "456 Ocean Drive, Beachfront",
      "city": "Miami",
      "country": "USA",
      "latitude": 25.7617,
      "longitude": -80.1918,
      "phone": "+1-555-0456",
      "email": "reservations@seasideresort.com",
      "website": "https://seasideresort.com",
      "images": [
        "/assets/image-10.avif",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": true,
        "gym": true,
        "spa": true,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": true,
        "business_center": false,
        "pet_friendly": true,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Ocean View Room",
          "price": 280,
          "capacity": 2,
          "size": "40 sqm"
        },
        {
          "type": "Beach Villa",
          "price": 480,
          "capacity": 4,
          "size": "80 sqm"
        },
        {
          "type": "Presidential Villa",
          "price": 850,
          "capacity": 8,
          "size": "150 sqm"
        }
      ],
      "check_in": "16:00",
      "check_out": "12:00",
      "languages": ["English", "Spanish", "Portuguese"],
      "payment_methods": ["Credit Card", "Cash", "Bank Transfer"],
      "cancellation_policy": "Free cancellation up to 48 hours before check-in"
    },
    {
      "id": 3,
      "name": "Mountain Lodge Retreat",
      "description": "Cozy mountain lodge nestled in the heart of nature, offering breathtaking views, hiking trails, and a peaceful escape from city life.",
      "category": "lodge",
      "rating": 4.4,
      "price_per_night": 180,
      "currency": "USD",
      "address": "789 Mountain Peak Road",
      "city": "Aspen",
      "country": "USA",
      "latitude": 39.1911,
      "longitude": -106.8175,
      "phone": "+1-555-0789",
      "email": "info@mountainlodge.com",
      "website": "https://mountainlodge.com",
      "images": [
        "/assets/image-9.avif",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": false,
        "gym": false,
        "spa": true,
        "restaurant": true,
        "bar": true,
        "room_service": false,
        "concierge": true,
        "business_center": false,
        "pet_friendly": true,
        "air_conditioning": false,
        "elevator": false,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Standard Cabin",
          "price": 180,
          "capacity": 2,
          "size": "25 sqm"
        },
        {
          "type": "Family Cabin",
          "price": 280,
          "capacity": 4,
          "size": "45 sqm"
        },
        {
          "type": "Luxury Suite",
          "price": 450,
          "capacity": 6,
          "size": "75 sqm"
        }
      ],
      "check_in": "15:00",
      "check_out": "11:00",
      "languages": ["English", "German", "French"],
      "payment_methods": ["Credit Card", "Cash"],
      "cancellation_policy": "Free cancellation up to 7 days before check-in"
    },
    {
      "id": 4,
      "name": "Urban Boutique Hotel",
      "description": "Modern boutique hotel in the trendy arts district, featuring contemporary design, rooftop terrace, and proximity to galleries and restaurants.",
      "category": "boutique",
      "rating": 4.5,
      "price_per_night": 220,
      "currency": "USD",
      "address": "321 Arts District Boulevard",
      "city": "Los Angeles",
      "country": "USA",
      "latitude": 34.0522,
      "longitude": -118.2437,
      "phone": "+1-555-0321",
      "email": "stay@urbanboutique.com",
      "website": "https://urbanboutique.com",
      "images": [
        "/assets/image-16.avif",
        "https://images.unsplash.com/photo-1586611292717-f828b167408c",
        "https://images.unsplash.com/photo-1574032740630-5d5b08be4ba4",
        "https://images.unsplash.com/photo-1592229505726-ca121723b8ef"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": false,
        "gym": true,
        "spa": false,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": true,
        "business_center": true,
        "pet_friendly": true,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Urban Room",
          "price": 220,
          "capacity": 2,
          "size": "30 sqm"
        },
        {
          "type": "Loft Suite",
          "price": 380,
          "capacity": 4,
          "size": "55 sqm"
        },
        {
          "type": "Penthouse",
          "price": 650,
          "capacity": 6,
          "size": "90 sqm"
        }
      ],
      "check_in": "15:00",
      "check_out": "12:00",
      "languages": ["English", "Spanish", "Korean"],
      "payment_methods": ["Credit Card", "PayPal", "Apple Pay"],
      "cancellation_policy": "Free cancellation up to 24 hours before check-in"
    },
    {
      "id": 5,
      "name": "Historic Manor Inn",
      "description": "Charming historic inn dating back to 1890, beautifully restored with period furnishings while offering modern amenities and comfort.",
      "category": "historic",
      "rating": 4.3,
      "price_per_night": 160,
      "currency": "USD",
      "address": "567 Heritage Lane",
      "city": "Charleston",
      "country": "USA",
      "latitude": 32.7765,
      "longitude": -79.9311,
      "phone": "+1-555-0567",
      "email": "info@historicmanor.com",
      "website": "https://historicmanor.com",
      "images": [
        "/assets/image-8.avif",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
        "https://images.unsplash.com/photo-1586611292717-f828b167408c",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": false,
        "gym": false,
        "spa": false,
        "restaurant": true,
        "bar": true,
        "room_service": false,
        "concierge": true,
        "business_center": false,
        "pet_friendly": false,
        "air_conditioning": true,
        "elevator": false,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Heritage Room",
          "price": 160,
          "capacity": 2,
          "size": "28 sqm"
        },
        {
          "type": "Manor Suite",
          "price": 240,
          "capacity": 3,
          "size": "42 sqm"
        },
        {
          "type": "Presidential Suite",
          "price": 380,
          "capacity": 4,
          "size": "68 sqm"
        }
      ],
      "check_in": "14:00",
      "check_out": "11:00",
      "languages": ["English", "French", "Spanish"],
      "payment_methods": ["Credit Card", "Cash", "Check"],
      "cancellation_policy": "Free cancellation up to 48 hours before check-in"
    },
    {
      "id": 6,
      "name": "Desert Oasis Resort",
      "description": "Luxury desert resort featuring stunning architecture, championship golf course, world-class spa, and breathtaking sunset views.",
      "category": "resort",
      "rating": 4.7,
      "price_per_night": 320,
      "currency": "USD",
      "address": "890 Desert Vista Drive",
      "city": "Scottsdale",
      "country": "USA",
      "latitude": 33.4942,
      "longitude": -111.9261,
      "phone": "+1-555-0890",
      "email": "reservations@desertoasis.com",
      "website": "https://desertoasis.com",
      "images": [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": true,
        "gym": true,
        "spa": true,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": true,
        "business_center": true,
        "pet_friendly": true,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Desert View Room",
          "price": 320,
          "capacity": 2,
          "size": "45 sqm"
        },
        {
          "type": "Casita Suite",
          "price": 520,
          "capacity": 4,
          "size": "85 sqm"
        },
        {
          "type": "Presidential Villa",
          "price": 950,
          "capacity": 8,
          "size": "180 sqm"
        }
      ],
      "check_in": "16:00",
      "check_out": "12:00",
      "languages": ["English", "Spanish", "German"],
      "payment_methods": ["Credit Card", "Cash", "Bank Transfer"],
      "cancellation_policy": "Free cancellation up to 72 hours before check-in"
    },
    {
      "id": 7,
      "name": "Riverside Business Hotel",
      "description": "Modern business hotel along the river, featuring state-of-the-art meeting facilities, executive lounge, and convenient city center location.",
      "category": "business",
      "rating": 4.2,
      "price_per_night": 195,
      "currency": "USD",
      "address": "234 Riverside Plaza",
      "city": "Chicago",
      "country": "USA",
      "latitude": 41.8781,
      "longitude": -87.6298,
      "phone": "+1-555-0234",
      "email": "business@riversidehotel.com",
      "website": "https://riversidehotel.com",
      "images": [
        "https://images.unsplash.com/photo-1592229505726-ca121723b8ef",
        "https://images.unsplash.com/photo-1592229505726-ca121723b8ef",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": false,
        "gym": true,
        "spa": false,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": true,
        "business_center": true,
        "pet_friendly": false,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Executive Room",
          "price": 195,
          "capacity": 2,
          "size": "32 sqm"
        },
        {
          "type": "Business Suite",
          "price": 295,
          "capacity": 3,
          "size": "48 sqm"
        },
        {
          "type": "Executive Suite",
          "price": 450,
          "capacity": 4,
          "size": "72 sqm"
        }
      ],
      "check_in": "15:00",
      "check_out": "12:00",
      "languages": ["English", "Spanish", "Chinese"],
      "payment_methods": ["Credit Card", "Corporate Account", "Bank Transfer"],
      "cancellation_policy": "Free cancellation up to 24 hours before check-in"
    },
    {
      "id": 8,
      "name": "Lakefront Lodge",
      "description": "Peaceful lakefront lodge offering stunning water views, fishing opportunities, kayak rentals, and a cozy atmosphere perfect for relaxation.",
      "category": "lodge",
      "rating": 4.4,
      "price_per_night": 145,
      "currency": "USD",
      "address": "678 Lakeshore Drive",
      "city": "Lake Tahoe",
      "country": "USA",
      "latitude": 39.0968,
      "longitude": -120.0324,
      "phone": "+1-555-0678",
      "email": "info@lakefrontlodge.com",
      "website": "https://lakefrontlodge.com",
      "images": [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": false,
        "gym": false,
        "spa": false,
        "restaurant": true,
        "bar": true,
        "room_service": false,
        "concierge": false,
        "business_center": false,
        "pet_friendly": true,
        "air_conditioning": false,
        "elevator": false,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Lakefront Room",
          "price": 145,
          "capacity": 2,
          "size": "30 sqm"
        },
        {
          "type": "Family Cabin",
          "price": 225,
          "capacity": 4,
          "size": "50 sqm"
        },
        {
          "type": "Luxury Cabin",
          "price": 345,
          "capacity": 6,
          "size": "80 sqm"
        }
      ],
      "check_in": "15:00",
      "check_out": "11:00",
      "languages": ["English", "Spanish"],
      "payment_methods": ["Credit Card", "Cash"],
      "cancellation_policy": "Free cancellation up to 48 hours before check-in"
    },
    {
      "id": 9,
      "name": "City Center Suites",
      "description": "Modern apartment-style suites in the heart of downtown, featuring full kitchens, separate living areas, and easy access to shopping and dining.",
      "category": "extended_stay",
      "rating": 4.1,
      "price_per_night": 175,
      "currency": "USD",
      "address": "345 Downtown Street",
      "city": "Seattle",
      "country": "USA",
      "latitude": 47.6062,
      "longitude": -122.3321,
      "phone": "+1-555-0345",
      "email": "stay@citycentersuits.com",
      "website": "https://citycentersuits.com",
      "images": [
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
        "https://images.unsplash.com/photo-1586611292717-f828b167408c",
        "https://images.unsplash.com/photo-1574032740630-5d5b08be4ba4",
        "https://images.unsplash.com/photo-1592229505726-ca121723b8ef"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": false,
        "gym": true,
        "spa": false,
        "restaurant": false,
        "bar": false,
        "room_service": false,
        "concierge": false,
        "business_center": true,
        "pet_friendly": true,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Studio Suite",
          "price": 175,
          "capacity": 2,
          "size": "35 sqm"
        },
        {
          "type": "One Bedroom Suite",
          "price": 245,
          "capacity": 4,
          "size": "55 sqm"
        },
        {
          "type": "Two Bedroom Suite",
          "price": 345,
          "capacity": 6,
          "size": "85 sqm"
        }
      ],
      "check_in": "16:00",
      "check_out": "12:00",
      "languages": ["English", "Japanese", "Korean"],
      "payment_methods": ["Credit Card", "PayPal", "Bank Transfer"],
      "cancellation_policy": "Free cancellation up to 24 hours before check-in"
    },
    {
      "id": 10,
      "name": "Vineyard Estate Hotel",
      "description": "Elegant hotel set among rolling vineyards, offering wine tastings, farm-to-table dining, and luxurious accommodations in wine country.",
      "category": "luxury",
      "rating": 4.8,
      "price_per_night": 420,
      "currency": "USD",
      "address": "789 Vineyard Lane",
      "city": "Napa Valley",
      "country": "USA",
      "latitude": 38.5025,
      "longitude": -122.2654,
      "phone": "+1-555-0789",
      "email": "info@vineyardestate.com",
      "website": "https://vineyardestate.com",
      "images": [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": true,
        "gym": false,
        "spa": true,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": true,
        "business_center": false,
        "pet_friendly": false,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Vineyard View Room",
          "price": 420,
          "capacity": 2,
          "size": "40 sqm"
        },
        {
          "type": "Estate Suite",
          "price": 650,
          "capacity": 4,
          "size": "70 sqm"
        },
        {
          "type": "Villa",
          "price": 1200,
          "capacity": 8,
          "size": "150 sqm"
        }
      ],
      "check_in": "15:00",
      "check_out": "12:00",
      "languages": ["English", "French", "Italian"],
      "payment_methods": ["Credit Card", "Cash", "Bank Transfer"],
      "cancellation_policy": "Free cancellation up to 48 hours before check-in"
    },
    {
      "id": 11,
      "name": "Airport Transit Hotel",
      "description": "Convenient airport hotel with 24-hour shuttle service, soundproof rooms, and amenities designed for travelers with early flights or layovers.",
      "category": "airport",
      "rating": 4.0,
      "price_per_night": 125,
      "currency": "USD",
      "address": "567 Airport Boulevard",
      "city": "Denver",
      "country": "USA",
      "latitude": 39.8561,
      "longitude": -104.6737,
      "phone": "+1-555-0567",
      "email": "info@airporttransit.com",
      "website": "https://airporttransit.com",
      "images": [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": false,
        "gym": true,
        "spa": false,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": false,
        "business_center": true,
        "pet_friendly": false,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Standard Room",
          "price": 125,
          "capacity": 2,
          "size": "25 sqm"
        },
        {
          "type": "Executive Room",
          "price": 165,
          "capacity": 2,
          "size": "30 sqm"
        },
        {
          "type": "Suite",
          "price": 225,
          "capacity": 4,
          "size": "50 sqm"
        }
      ],
      "check_in": "24/7",
      "check_out": "24/7",
      "languages": ["English", "Spanish", "German"],
      "payment_methods": ["Credit Card", "Cash", "Mobile Payment"],
      "cancellation_policy": "Free cancellation up to 6 hours before check-in"
    },
    {
      "id": 12,
      "name": "Family Fun Resort",
      "description": "All-inclusive family resort with water park, kids' club, multiple restaurants, and entertainment programs for all ages.",
      "category": "family",
      "rating": 4.5,
      "price_per_night": 295,
      "currency": "USD",
      "address": "890 Family Way",
      "city": "Orlando",
      "country": "USA",
      "latitude": 28.5383,
      "longitude": -81.3792,
      "phone": "+1-555-0890",
      "email": "reservations@familyfunresort.com",
      "website": "https://familyfunresort.com",
      "images": [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": true,
        "gym": true,
        "spa": true,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": true,
        "business_center": false,
        "pet_friendly": false,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Family Room",
          "price": 295,
          "capacity": 4,
          "size": "45 sqm"
        },
        {
          "type": "Family Suite",
          "price": 425,
          "capacity": 6,
          "size": "65 sqm"
        },
        {
          "type": "Presidential Family Suite",
          "price": 650,
          "capacity": 8,
          "size": "120 sqm"
        }
      ],
      "check_in": "16:00",
      "check_out": "11:00",
      "languages": ["English", "Spanish", "Portuguese"],
      "payment_methods": ["Credit Card", "Cash", "All-Inclusive Packages"],
      "cancellation_policy": "Free cancellation up to 14 days before check-in"
    },
    {
      "id": 13,
      "name": "Eco-Friendly Retreat",
      "description": "Sustainable eco-lodge featuring solar power, organic gardens, locally-sourced cuisine, and nature-based activities in a pristine environment.",
      "category": "eco",
      "rating": 4.6,
      "price_per_night": 210,
      "currency": "USD",
      "address": "123 Green Valley Road",
      "city": "Portland",
      "country": "USA",
      "latitude": 45.5152,
      "longitude": -122.6784,
      "phone": "+1-555-0123",
      "email": "info@ecoretreat.com",
      "website": "https://ecoretreat.com",
      "images": [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": false,
        "gym": false,
        "spa": true,
        "restaurant": true,
        "bar": false,
        "room_service": false,
        "concierge": true,
        "business_center": false,
        "pet_friendly": true,
        "air_conditioning": false,
        "elevator": false,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Eco Cabin",
          "price": 210,
          "capacity": 2,
          "size": "30 sqm"
        },
        {
          "type": "Family Eco Suite",
          "price": 320,
          "capacity": 4,
          "size": "55 sqm"
        },
        {
          "type": "Luxury Eco Villa",
          "price": 485,
          "capacity": 6,
          "size": "85 sqm"
        }
      ],
      "check_in": "15:00",
      "check_out": "11:00",
      "languages": ["English", "Spanish", "German"],
      "payment_methods": ["Credit Card", "Cash", "Eco-Credits"],
      "cancellation_policy": "Free cancellation up to 48 hours before check-in"
    },
    {
      "id": 14,
      "name": "Ski Lodge Alpine",
      "description": "Premier ski-in/ski-out lodge at the base of the mountain, featuring cozy fireplaces, ski rentals, and après-ski dining.",
      "category": "ski",
      "rating": 4.7,
      "price_per_night": 380,
      "currency": "USD",
      "address": "456 Alpine Drive",
      "city": "Vail",
      "country": "USA",
      "latitude": 39.6403,
      "longitude": -106.3742,
      "phone": "+1-555-0456",
      "email": "reservations@skilodgealpine.com",
      "website": "https://skilodgealpine.com",
      "images": [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": true,
        "gym": true,
        "spa": true,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": true,
        "business_center": false,
        "pet_friendly": true,
        "air_conditioning": false,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Alpine Room",
          "price": 380,
          "capacity": 2,
          "size": "35 sqm"
        },
        {
          "type": "Ski Suite",
          "price": 580,
          "capacity": 4,
          "size": "60 sqm"
        },
        {
          "type": "Mountain Villa",
          "price": 950,
          "capacity": 8,
          "size": "140 sqm"
        }
      ],
      "check_in": "16:00",
      "check_out": "11:00",
      "languages": ["English", "German", "French"],
      "payment_methods": ["Credit Card", "Cash", "Ski Pass Bundle"],
      "cancellation_policy": "Free cancellation up to 7 days before check-in"
    },
    {
      "id": 15,
      "name": "Casino Resort Grand",
      "description": "Luxury casino resort with world-class gaming, spectacular shows, fine dining, and opulent accommodations in the entertainment capital.",
      "category": "casino",
      "rating": 4.4,
      "price_per_night": 275,
      "currency": "USD",
      "address": "789 Casino Boulevard",
      "city": "Las Vegas",
      "country": "USA",
      "latitude": 36.1699,
      "longitude": -115.1398,
      "phone": "+1-555-0789",
      "email": "vip@casinoresortgrand.com",
      "website": "https://casinoresortgrand.com",
      "images": [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": true,
        "gym": true,
        "spa": true,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": true,
        "business_center": true,
        "pet_friendly": false,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Standard Room",
          "price": 275,
          "capacity": 2,
          "size": "40 sqm"
        },
        {
          "type": "Premium Suite",
          "price": 450,
          "capacity": 4,
          "size": "70 sqm"
        },
        {
          "type": "VIP Penthouse",
          "price": 1500,
          "capacity": 8,
          "size": "200 sqm"
        }
      ],
      "check_in": "15:00",
      "check_out": "12:00",
      "languages": ["English", "Spanish", "Chinese"],
      "payment_methods": ["Credit Card", "Cash", "Casino Credits"],
      "cancellation_policy": "Free cancellation up to 24 hours before check-in"
    },
    {
      "id": 16,
      "name": "Beachfront Paradise",
      "description": "Tropical beachfront resort with pristine white sand beaches, water sports, multiple pools, and island-style dining experiences.",
      "category": "beach",
      "rating": 4.8,
      "price_per_night": 340,
      "currency": "USD",
      "address": "321 Paradise Beach Road",
      "city": "Key West",
      "country": "USA",
      "latitude": 24.5551,
      "longitude": -81.7821,
      "phone": "+1-555-0321",
      "email": "paradise@beachfrontparadise.com",
      "website": "https://beachfrontparadise.com",
      "images": [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": true,
        "gym": true,
        "spa": true,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": true,
        "business_center": false,
        "pet_friendly": false,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Ocean View Room",
          "price": 340,
          "capacity": 2,
          "size": "42 sqm"
        },
        {
          "type": "Beachfront Suite",
          "price": 520,
          "capacity": 4,
          "size": "75 sqm"
        },
        {
          "type": "Paradise Villa",
          "price": 850,
          "capacity": 6,
          "size": "130 sqm"
        }
      ],
      "check_in": "16:00",
      "check_out": "12:00",
      "languages": ["English", "Spanish", "French"],
      "payment_methods": ["Credit Card", "Cash", "Resort Credits"],
      "cancellation_policy": "Free cancellation up to 48 hours before check-in"
    },
    {
      "id": 17,
      "name": "Urban Loft Hotel",
      "description": "Contemporary loft-style hotel in the warehouse district, featuring exposed brick, industrial design, and rooftop terrace with city views.",
      "category": "urban",
      "rating": 4.3,
      "price_per_night": 185,
      "currency": "USD",
      "address": "654 Warehouse District",
      "city": "Austin",
      "country": "USA",
      "latitude": 30.2672,
      "longitude": -97.7431,
      "phone": "+1-555-0654",
      "email": "stay@urbanloft.com",
      "website": "https://urbanloft.com",
      "images": [
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
        "https://images.unsplash.com/photo-1586611292717-f828b167408c",
        "https://images.unsplash.com/photo-1574032740630-5d5b08be4ba4",
        "https://images.unsplash.com/photo-1592229505726-ca121723b8ef"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": false,
        "gym": true,
        "spa": false,
        "restaurant": true,
        "bar": true,
        "room_service": false,
        "concierge": false,
        "business_center": true,
        "pet_friendly": true,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Loft Room",
          "price": 185,
          "capacity": 2,
          "size": "38 sqm"
        },
        {
          "type": "Studio Loft",
          "price": 265,
          "capacity": 3,
          "size": "55 sqm"
        },
        {
          "type": "Penthouse Loft",
          "price": 425,
          "capacity": 4,
          "size": "85 sqm"
        }
      ],
      "check_in": "15:00",
      "check_out": "12:00",
      "languages": ["English", "Spanish", "German"],
      "payment_methods": ["Credit Card", "PayPal", "Crypto"],
      "cancellation_policy": "Free cancellation up to 24 hours before check-in"
    },
    {
      "id": 18,
      "name": "Golf Resort Championship",
      "description": "Premier golf resort featuring two championship courses, professional instruction, luxury spa, and elegant clubhouse dining.",
      "category": "golf",
      "rating": 4.6,
      "price_per_night": 365,
      "currency": "USD",
      "address": "987 Golf Course Drive",
      "city": "Pebble Beach",
      "country": "USA",
      "latitude": 36.5681,
      "longitude": -121.9456,
      "phone": "+1-555-0987",
      "email": "teetimes@golfresort.com",
      "website": "https://golfresort.com",
      "images": [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": true,
        "gym": true,
        "spa": true,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": true,
        "business_center": true,
        "pet_friendly": false,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Fairway Room",
          "price": 365,
          "capacity": 2,
          "size": "45 sqm"
        },
        {
          "type": "Golf Suite",
          "price": 565,
          "capacity": 4,
          "size": "80 sqm"
        },
        {
          "type": "Championship Villa",
          "price": 985,
          "capacity": 6,
          "size": "160 sqm"
        }
      ],
      "check_in": "16:00",
      "check_out": "12:00",
      "languages": ["English", "Spanish", "Japanese"],
      "payment_methods": ["Credit Card", "Cash", "Golf Packages"],
      "cancellation_policy": "Free cancellation up to 72 hours before check-in"
    },
    {
      "id": 19,
      "name": "Spa Wellness Retreat",
      "description": "Tranquil wellness retreat focused on relaxation and rejuvenation, featuring holistic treatments, yoga classes, and healthy cuisine.",
      "category": "spa",
      "rating": 4.7,
      "price_per_night": 295,
      "currency": "USD",
      "address": "432 Serenity Lane",
      "city": "Sedona",
      "country": "USA",
      "latitude": 34.8697,
      "longitude": -111.7610,
      "phone": "+1-555-0432",
      "email": "wellness@spawellness.com",
      "website": "https://spawellness.com",
      "images": [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": true,
        "gym": true,
        "spa": true,
        "restaurant": true,
        "bar": false,
        "room_service": true,
        "concierge": true,
        "business_center": false,
        "pet_friendly": false,
        "air_conditioning": true,
        "elevator": false,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Zen Room",
          "price": 295,
          "capacity": 2,
          "size": "35 sqm"
        },
        {
          "type": "Wellness Suite",
          "price": 425,
          "capacity": 3,
          "size": "60 sqm"
        },
        {
          "type": "Serenity Villa",
          "price": 695,
          "capacity": 4,
          "size": "95 sqm"
        }
      ],
      "check_in": "15:00",
      "check_out": "12:00",
      "languages": ["English", "Spanish", "Hindi"],
      "payment_methods": ["Credit Card", "Cash", "Wellness Packages"],
      "cancellation_policy": "Free cancellation up to 48 hours before check-in"
    },
    {
      "id": 20,
      "name": "Business Executive Hotel",
      "description": "Premium business hotel featuring executive floors, state-of-the-art conference facilities, and personalized concierge services for corporate travelers.",
      "category": "business",
      "rating": 4.5,
      "price_per_night": 285,
      "currency": "USD",
      "address": "876 Executive Plaza",
      "city": "San Francisco",
      "country": "USA",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "phone": "+1-555-0876",
      "email": "corporate@businessexecutive.com",
      "website": "https://businessexecutive.com",
      "images": [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427"
      ],
      "amenities": {
        "wifi": true,
        "parking": true,
        "pool": false,
        "gym": true,
        "spa": true,
        "restaurant": true,
        "bar": true,
        "room_service": true,
        "concierge": true,
        "business_center": true,
        "pet_friendly": false,
        "air_conditioning": true,
        "elevator": true,
        "laundry": true
      },
      "room_types": [
        {
          "type": "Executive Room",
          "price": 285,
          "capacity": 2,
          "size": "40 sqm"
        },
        {
          "type": "Business Suite",
          "price": 425,
          "capacity": 3,
          "size": "65 sqm"
        },
        {
          "type": "Corporate Penthouse",
          "price": 785,
          "capacity": 6,
          "size": "120 sqm"
        }
      ],
      "check_in": "15:00",
      "check_out": "12:00",
      "languages": ["English", "Chinese", "Japanese"],
      "payment_methods": ["Credit Card", "Corporate Account", "Bank Transfer"],
      "cancellation_policy": "Free cancellation up to 24 hours before check-in"
    }
  ]
