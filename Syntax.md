# Syntax of the Kino Wardley Map

## Introduction

This is the documentation that is typically missing from a component like this.

It is a description of each of the options available in the mini-language.

Conceptually the wardley map has a vertical axis ranging from 0 to 1 (don't use 1, the offset logic used to display will probably render the component outside of the visible area of the svg) representing visibility and a horizontal axis ranging from 0 to 1 (don't use 1) representing evolution.

The code will attempt to render the supplied specification and will try to ignore input it does
not recognise. Please raise an issue at the github project with sample minimal specs that break the parser.

Don't get too hung up on precise placement is the general relationships that matter.

The initial syntax was inspired by onlinewardleymaps.com and is largely compatible. It is now beginning to diverge, but does agree on anything used on the tea shop example.

Compatability is why locations are [visibility, evolution] where labels are the other way around [evolution, visibility].
Locations are in the 0-1 range where as labels are pixels.

Typically KinoWardley.Output is fed a specification that looks like this:

```
"""
title Tea Shop
anchor Business [0.95, 0.63]
anchor Public [0.95, 0.78]
component Cup of Tea [0.79, 0.61] label [19, -4]
component Cup [0.73, 0.78]
component Tea [0.63, 0.81]
component Hot Water [0.52, 0.80]
component Water [0.38, 0.82]
component Kettle [0.43, 0.35] label [-57, 4]
evolve Kettle 0.62 label [16, 7]
component Power [0.1, 0.7] label [-27, 20]
evolve Power 0.89 label [-12, 21]
Business->Cup of Tea
Public->Cup of Tea
Cup of Tea->Cup
Cup of Tea->Tea
Cup of Tea->Hot Water
Hot Water->Water
Hot Water->Kettle 
Kettle->Power

annotation 1 [[0.43,0.49],[0.08,0.79]] Standardising power allows Kettles to evolve faster
annotation 2 [0.48, 0.85] Hot water is obvious and well known
annotations [0.60, 0.02]

note +a generic note appeared [0.23, 0.33]

style wardley
"""
```

Each line starts with one of the keywords (listed below) or is considered a relationship.

By convention keywords start with lower case letter and Components start with a Capital letter.

## Keywords

- anchor
- annotation
- annotations
- background
- build
- buy
- outsource
- component
- evolve
- evolution
- group
- height
- id
- market
- note
- or
- padding
- style
- title
- width

### anchor

These are the root needs that the wardley map is anchored to.

```
anchor Name of Anchor [0.95, 0.7]
anchor Customer [0.95, 0.9] label [-10, 5]
```

The name of the `anchor` is followed by a location [vertical, horizontal].
These are each in the range (0 - 1] and may be floating point numbers.

It has an optional `label` offset [horizontal, vertical] that can be used to shift the location of the label relative to it's anchor point. This can be helpful to make the diagram clearer.

### annotation

This allows the map to be annotated with explanations. This serves two purposes: adding a label to the map (possibly in multiple places) and providing data for the `annotaions` keyword.

Note that if used in a livebook it may make more sense to provide the details in a markdown field outside of the map,

```
annotation 1 [[0.43,0.49],[0.08,0.79]] Standardising power allows Kettles to evolve faster
annotation 2 [0.48, 0.85] Hot water is obvious and well known
```

`annotation` is followed by a label (assumed to be a single character, symbol or digit, which can't be `[`). 

This is followed either by one location in [visibility, evolution] format or a list of locations also in [visibility, evolution] format. These expect the values to be floats in the range (0,1]. 

This is followed by the text used for the annotations.

### annotations

This provides the location to display the annotation details. Please find an unused section of the map to place these.

If you can't find a suitable place consider putting the text in a markdown cell on the same livebook and skipping the annotations keyword.

```
annotations [0.60, 0.02]
```

The location is a [visibility, evolution] pair. This expects the values to be floats in the range (0,1].

### background

This allows the background colour of the map to be specified.

```
background grey
background #001001
```

It will treat the supplied value as a colour.

Be warned that the lines on the map are currently drawn in black so using a too dark background may reduce the utility of the map.

### build

This changes the size of the circle drawn for the component named.

Must be set after the component it references.

```
component Tea [0.5, 0.5] label [10, 0]
build Tea
```

### buy

This changes the size of the circle drawn for the component named.

Must be set after the component it references.
```
component Tea [0.5, 0.5] label [10, 0]
buy Tea
```

### component

Defines the basic items that the Wardley Map is built out of. It's only limited by your imagination as to what these mean!

```
component Cup of Tea [0.79, 0.61] label [19, -4]
component Cup [0.73, 0.78]
component Cup of Tea [0.79, 0.61] inertia label [-40, -30]
component Cup [0.73, 0.78] xor
```

It has a name, followed by a location in a [visibility, evolution] pair. This expects the values to be floats in the range (0, 1].

Note that a component name cannot include a zero if it needs to evolve.

It has an optional `label` offset [horizontal, vertical] that can be used to shift the location of the label relative to it's component point. This can be helpful to make the diagram clearer.

There is an optional attribute of inertia that will mark the component as being harder to evolve.

There is an optional attribute of xor which will display a crossed out square instead of a circle.

### evolve

This represents the movement of a component (typically) along the evolution axis. This represents the main form of movement on a Wardley Map.

You need to define a component before evolving it or it will not render.

```
component Kettle [0.43, 0.35] label [-57, 4]
evolve Kettle 0.62 label [16, 7]
component Power [0.1, 0.7] label [-27, 20]
evolve Power [0.1, 0.89] label [-12, 21]
B
```

There are two forms of evolve. One has the new evolution axis value and will inherit the value from the base component.

The second matches the component syntax.

Either version may have a label in the same format as the component.

You are limited to one evolution per component per diagram.

### evolution

This allows the labels on the horizontal axis to be replaced (or suppressed).

```
evolution
evolution First->Second->Third->Fourth
evolution Novel->Emerging->Good->Best
```

The order within the evolution defines the order shown. It is possible to miss a section out.

Only the last `evolution` keyword in the spec will be applied.

### group

Draws an ellipse on the background of the Wardley Map. Intended to be used to group components together.

```
group first [0.605, 0.85, 20, 50] yellow black
group first [0.605, 0.85, 20, 50] yellow
```

The name is unique within the spec.

The list of numbers is [visibility, evolution, vertical radius, horizontal radius]. Visibility and evolution are in the range (0, 1]. The radii are specified in pixels and must be an integer.

The next field is the fill colour for the group.

The last field is the border colour. If not specified it will default to the fill colour.

Again be careful with the colours as these can obscure the lines.

### height

This allows the height of the rendered image to be specified in pixels. This is optional and will be defaulted to 400

```
height 800
```

Again only the last use of this keyword will be applied.

Please note that offsets are not relative to the size of the image so you may need to adjust them if you change the height or width.

### id

This allows the id of the svg used for this Wardley Map to be specified.

```
id myId
```

This is entirely optional.

### market

This represents a market.

```
market PCW [0.5, 0.5] 
market PCW [0.5, 0.5] label [10, -20]
market PCW [0.5, 0.5] label [10, -20] inertia
```

These follow the same layout rules as components, and may also evolve.

### note

This allows free text to be added to the diagram for clarity.

```
note +a generic note appeared [0.23, 0.33]
```

The `+` is purely conventional for Wardley Maps and may be ignored. The location [visibility, evolution] are both in the range (0, 1].

This describes where to draw the note.

### or

This is similar to group, but draws a square.

```
or first [0.605, 0.85, 0.7, 0.9] yellow black
or first [0.605, 0.85, 0.75, 0.91] yellow
```

All four coordinates provide the bottom right and top level area of a rectangle.

All four values are floats from the range (0,1]

The two colour values are fill and border.

This is intended to be used to group multiple components to indicate an OR condition, but could easily be used as a square version of `group`.

### outsource

This changes the size of the circle drawn for the component named.

Must be set after the component it references.
```
component Tea [0.5, 0.5] label [10, 0]
outsource Tea
```

### padding

This allows the padding spacing around the diagram to be controlled. This is an integer value and is optional. It will default to 20 pixels. It's the same value used for top, bottom, left and right.

```
padding 21
```

### style

This allows the style of the wardley map to be defined. 

```
style
style wardley
```

This is an optional field. If specified it will suppress the white background drawn for all text fields.

If set to wardley it attempts to replicate the linear fill used by Simon Wardley for his maps.

Currently the other values defined by onlinewardleymaps.com are not implemented.

### title
This allows the map to be given a title. This is optional.

```
title Tea Shop
```

Only the last entry of this keyword will be used if repeated.

### width

This allows the width of the rendered image to be specified in pixels. This is optional and will be defaulted to 800

```
width 400
```

Again only the last use of this keyword will be applied.

## Relationships

There are two kinds of relationships.

If they are not rendering please check that the names are spelt correctly. It requires an exact match.

### Link

```
first name->second name
```

This will draw a line between the two attached items and any evolved items of either component.

### Flow

```
first name+<>second name
```

This will draw a highlighted line between the two components. It does not follow to evolved items.

### Constraint

```
first name-c>second name
```

This indicates a constraint.

### Negative Influence

```
first name-v>second name
```

This indicates a negative influence.

### Positive Influence

```
first name+v>second name
```

This indicates a positive influence.