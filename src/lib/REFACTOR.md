# Problem description

Our objective is to represent only one disjoint representation of an object at a time while enabling features such as the picking capability. How can we achieve this?

Knowing that, for example, for the Iso-contours, the returned object can be either
- a Mesh
- a Group
- a LineSegments

We can have for example for a triangulated mesh
```
Surface -|>- Group
    - plain: Mesh
        - userData.object: Surface
    - contours: Mesh | Group | LineSegments
        - userData.object: Surface (for each)
    - other possible presentations
    - userData.object: Surface

```
What is picked is not the parent group, but rather its current representation (plain, contours, etc...). Therefore, a reference to the Surface is necesary in each representation.

For each representation inside Surface, we have
- own parameters
- save/restore state

## Other solution

Another solution for disjoint rendering of an object is to make mutation while keeping main information encapsulated in the object.

It is the most simple implementation.
