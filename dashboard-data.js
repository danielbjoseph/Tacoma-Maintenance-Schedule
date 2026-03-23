window.TACOMA_DASHBOARD_DATA = {
  "generatedAt": "2026-03-23T03:39:38.490Z",
  "assumptions": {
    "maxMileage": 500000,
    "cycleMileage": 100000,
    "cycleRepeatCount": 5,
    "extrapolationMethod": "Repeat the populated 0-100k JSON maintenance schedule for each additional 100k block through 500k miles."
  },
  "valueModel": {
    "vehicle": "2022 Toyota Tacoma V6 SR5 Access Cab 6' bed",
    "purchasePrice": 37000,
    "purchaseDate": "2022-08-01",
    "currentMileage": 75000,
    "currentDate": "2026-03-22",
    "currentCondition": "Good",
    "currentPrivatePartyValue": 21050,
    "currentTradeInValue": 18100,
    "edmundsTypicalMileageAveragePrivatePartyValue": 27112,
    "assumedTypicalMilesPerYear": 12000,
    "salvageFloor": 3000,
    "ageResidualAnchors": [
      {
        "ageYears": 0,
        "residual": 1
      },
      {
        "ageYears": 3,
        "residual": 0.9677041048
      },
      {
        "ageYears": 5,
        "residual": 0.8009801072
      },
      {
        "ageYears": 7,
        "residual": 0.7110839138
      },
      {
        "ageYears": 10,
        "residual": 0.6318567509
      }
    ],
    "inflectionThresholds": {
      "maintenanceToValueCaution": 0.05,
      "maintenanceToValueQuestionable": 0.1,
      "maintenanceToValueNotWorthIt": 0.15
    },
    "sources": [
      {
        "name": "Kelley Blue Book 2022 Tacoma Access Cab SR5 6 ft values",
        "url": "https://www.kbb.com/toyota/tacoma-access-cab/2022/sr5-pickup-4d-6-ft/"
      },
      {
        "name": "Edmunds 2022 Tacoma appraisal values",
        "url": "https://www.edmunds.com/toyota/tacoma/2022/appraisal-value/"
      },
      {
        "name": "iSeeCars Tacoma depreciation and resale",
        "url": "https://www.iseecars.com/car/toyota-tacoma/resale-value"
      },
      {
        "name": "iSeeCars Tacoma typical miles driven and lifespan",
        "url": "https://www.iseecars.com/car/toyota-tacoma"
      }
    ]
  },
  "services": [
    {
      "id": 1,
      "service": "Engine oil and filter",
      "cost": 85
    },
    {
      "id": 2,
      "service": "Tire rotation and inspect for damage",
      "cost": 30
    },
    {
      "id": 3,
      "service": "Cabin air filter",
      "cost": 60
    },
    {
      "id": 4,
      "service": "Engine intake air filter",
      "cost": 40
    },
    {
      "id": 5,
      "service": "Grease driveshaft (lithium chassis grease)",
      "cost": 95
    },
    {
      "id": 6,
      "service": "Transfer case oil (gear oil LF 75W)",
      "cost": 175
    },
    {
      "id": 7,
      "service": "Rear differential fluid (gear oil 75W-85 GL-5)",
      "cost": 160
    },
    {
      "id": 8,
      "service": "Front differential fluid (gear oil 75W-85 GL-5)",
      "cost": 160
    },
    {
      "id": 9,
      "service": "Spark plugs (Denso FK20HBR8, iridium)",
      "cost": 500
    },
    {
      "id": 10,
      "service": "Power steering fluid (Dexron II or III)",
      "cost": 185
    },
    {
      "id": 11,
      "service": "Engine coolant (Toyota SLLC)",
      "cost": 195
    },
    {
      "id": 12,
      "service": "Transmission fluid (Toyota ATF WS / manual-specific)",
      "cost": 300
    },
    {
      "id": 13,
      "service": "Rear brake shoes",
      "cost": 325
    },
    {
      "id": 14,
      "service": "Front brake pads",
      "cost": 285
    },
    {
      "id": 15,
      "service": "Serpentine belt",
      "cost": 150
    },
    {
      "id": 16,
      "service": "Brake fluid",
      "cost": 180
    }
  ],
  "intervals": [
    {
      "intervalK": 5,
      "required": [
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "Red"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 10,
      "required": [
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "White"
        },
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        },
        {
          "serviceId": 14,
          "service": "Front brake pads",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 15,
      "required": [
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "White"
        },
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "Red"
        },
        {
          "serviceId": 7,
          "service": "Rear differential fluid (gear oil 75W-85 GL-5)",
          "severity": "Red"
        },
        {
          "serviceId": 8,
          "service": "Front differential fluid (gear oil 75W-85 GL-5)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 20,
      "required": [
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "White"
        },
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 3,
          "service": "Cabin air filter",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        },
        {
          "serviceId": 13,
          "service": "Rear brake shoes",
          "severity": "Yellow"
        },
        {
          "serviceId": 14,
          "service": "Front brake pads",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 25,
      "required": [
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "Red"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        },
        {
          "serviceId": 16,
          "service": "Brake fluid",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 30,
      "required": [
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "White"
        },
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "White"
        },
        {
          "serviceId": 7,
          "service": "Rear differential fluid (gear oil 75W-85 GL-5)",
          "severity": "White"
        },
        {
          "serviceId": 8,
          "service": "Front differential fluid (gear oil 75W-85 GL-5)",
          "severity": "White"
        },
        {
          "serviceId": 6,
          "service": "Transfer case oil (gear oil LF 75W)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        },
        {
          "serviceId": 14,
          "service": "Front brake pads",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 35,
      "required": [
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "Red"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 40,
      "required": [
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "White"
        },
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 3,
          "service": "Cabin air filter",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        },
        {
          "serviceId": 13,
          "service": "Rear brake shoes",
          "severity": "Yellow"
        },
        {
          "serviceId": 14,
          "service": "Front brake pads",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 45,
      "required": [
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "White"
        },
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "Red"
        },
        {
          "serviceId": 7,
          "service": "Rear differential fluid (gear oil 75W-85 GL-5)",
          "severity": "Red"
        },
        {
          "serviceId": 8,
          "service": "Front differential fluid (gear oil 75W-85 GL-5)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 50,
      "required": [
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "White"
        },
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 10,
          "service": "Power steering fluid (Dexron II or III)",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        },
        {
          "serviceId": 14,
          "service": "Front brake pads",
          "severity": "Yellow"
        },
        {
          "serviceId": 16,
          "service": "Brake fluid",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 55,
      "required": [
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "Red"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 60,
      "required": [
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "White"
        },
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 3,
          "service": "Cabin air filter",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "White"
        },
        {
          "serviceId": 6,
          "service": "Transfer case oil (gear oil LF 75W)",
          "severity": "White"
        },
        {
          "serviceId": 7,
          "service": "Rear differential fluid (gear oil 75W-85 GL-5)",
          "severity": "White"
        },
        {
          "serviceId": 8,
          "service": "Front differential fluid (gear oil 75W-85 GL-5)",
          "severity": "White"
        },
        {
          "serviceId": 9,
          "service": "Spark plugs (Denso FK20HBR8, iridium)",
          "severity": "White"
        },
        {
          "serviceId": 12,
          "service": "Transmission fluid (Toyota ATF WS / manual-specific)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        },
        {
          "serviceId": 13,
          "service": "Rear brake shoes",
          "severity": "Yellow"
        },
        {
          "serviceId": 14,
          "service": "Front brake pads",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 65,
      "required": [
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "Red"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 70,
      "required": [
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "White"
        },
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        },
        {
          "serviceId": 14,
          "service": "Front brake pads",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 75,
      "required": [
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "White"
        },
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "Red"
        },
        {
          "serviceId": 7,
          "service": "Rear differential fluid (gear oil 75W-85 GL-5)",
          "severity": "Red"
        },
        {
          "serviceId": 8,
          "service": "Front differential fluid (gear oil 75W-85 GL-5)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        },
        {
          "serviceId": 16,
          "service": "Brake fluid",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 80,
      "required": [
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "White"
        },
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 3,
          "service": "Cabin air filter",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        },
        {
          "serviceId": 13,
          "service": "Rear brake shoes",
          "severity": "Yellow"
        },
        {
          "serviceId": 14,
          "service": "Front brake pads",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 85,
      "required": [
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "Red"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 90,
      "required": [
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "White"
        },
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "White"
        },
        {
          "serviceId": 7,
          "service": "Rear differential fluid (gear oil 75W-85 GL-5)",
          "severity": "White"
        },
        {
          "serviceId": 8,
          "service": "Front differential fluid (gear oil 75W-85 GL-5)",
          "severity": "White"
        },
        {
          "serviceId": 6,
          "service": "Transfer case oil (gear oil LF 75W)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        },
        {
          "serviceId": 14,
          "service": "Front brake pads",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 95,
      "required": [
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "Red"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        }
      ]
    },
    {
      "intervalK": 100,
      "required": [
        {
          "serviceId": 1,
          "service": "Engine oil and filter",
          "severity": "White"
        },
        {
          "serviceId": 2,
          "service": "Tire rotation and inspect for damage",
          "severity": "White"
        },
        {
          "serviceId": 3,
          "service": "Cabin air filter",
          "severity": "White"
        },
        {
          "serviceId": 10,
          "service": "Power steering fluid (Dexron II or III)",
          "severity": "White"
        },
        {
          "serviceId": 11,
          "service": "Engine coolant (Toyota SLLC)",
          "severity": "White"
        },
        {
          "serviceId": 12,
          "service": "Transmission fluid (Toyota ATF WS / manual-specific)",
          "severity": "White"
        },
        {
          "serviceId": 15,
          "service": "Serpentine belt",
          "severity": "White"
        },
        {
          "serviceId": 5,
          "service": "Grease driveshaft (lithium chassis grease)",
          "severity": "Red"
        }
      ],
      "asNeeded": [
        {
          "serviceId": 4,
          "service": "Engine intake air filter",
          "severity": "Yellow"
        },
        {
          "serviceId": 13,
          "service": "Rear brake shoes",
          "severity": "Yellow"
        },
        {
          "serviceId": 14,
          "service": "Front brake pads",
          "severity": "Yellow"
        },
        {
          "serviceId": 16,
          "service": "Brake fluid",
          "severity": "Yellow"
        }
      ]
    }
  ]
};
