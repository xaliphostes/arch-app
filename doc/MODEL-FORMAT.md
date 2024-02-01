# Model structure for Arch
A model for Arch is simply a `zip` file containing the pertinent files to characterize a model. For instance, in the model zip file, two components are mandatory:
- a folder named `in`
- a `model.json` file which describe the Arch model

Optionaly, a zip file can contain a `out` folder with the N simulations for each 3D object.

Generally, the zip file have the following structure

```
project
│   model.json (optional)
│   README.md (optional)
|   ... other user files
│
└─── in
|   └─── faults
│   │   NAME-1.ts
│   │   ...
|   |
|   └─── cavities
|   |   ...
|   |
|   └─── grids
│   |   NAME-1.vs/pl/ts/so
│   │   ...
│
└─── out
    |   inversion.json (optional)
    |
    └─── simulations
    |   └─── faults
    │   │   |   NAME-1.ts
    │   │   |   ...
    │   │   |
    |   └─── cavities
    │   │
    |   └─── grids
    │   │   |   NAME-1.vs/pl/ts/so
    │   │   |   ...
    │   │
    └─── forward
        └─── faults
        │   |   NAME-1.ts
        │   |   ...
        │   |
        └─── cavities
        │
        └─── grids
            |   NAME-1.vs/pl/ts/so
            |   ...
```

## 1) Supported [file formats](./file-format.md) for 3D objects

## 2) The [model.json](./json-model.md) file

## 3) The [in folder](./in-folder.md)

## 4) The [out folder](./out-folder.md)