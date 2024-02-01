# model.json file format
```json
{
    "name": "name",
    "options": {
        "young": 30e9,
        "poisson": 0.25,
        "density": 2300,
        "halfSpace": false
    },
    "faults": {
        "list": [
            "models/toto/in/f1.ts",
            "models/toto/in/f2.ts"
        ],
        "options": {
            "bcType": "ttb",
            "bcValue": "0 0 0"
        },
        "skins": [
        ]
    },
    "cavities": {
    },
    "grids": {
        "points": {
        },
        "lines": {
        },
        "regular": {
        },
        "mesh": {
            "list": [
                "models/toto/in/e.ts",
                "models/toto/in/f.ts",
                "models/toto/in/g.ts"
            ],
            "skins": [
                {
                    "type": "isocontours",
                    "params": {
                        "attribute": "S1",
                        "nb": 20,
                        "min": "auto",
                        "max": "auto",
                        "colortable": "insar"
                    }
                },
                {
                    "type": "vectorfield",
                    "params": {
                        "attribute": "U"
                    }
                }
            ]
        }
    }
}
```