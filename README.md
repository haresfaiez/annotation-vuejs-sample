# Annotation mini-application

## Installation

```
npm install
```

## Run

```
npm run start
```

## Client application

You can access the client application at: http://localhost:3000/client

## Admin application

You can access the admin application at: http://localhost:3000/admin

## Adding Entities

There are 3 methods to add an entity. Two from the document and a method wich tries to further minimize
the number of clicks to add an entity.

The second method (the one with a contextual "Add entity" button is hidden by default to allow space for
the new method.
It can be activated by setting ```window.useContextualMenu``` to ```true``` in the console

```
window.useContextualMenu = true

```

## Missing features
  * Rename a selection
  * Click on highlight to show the "Remove entity" button
  * Multiline selection