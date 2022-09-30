# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0]

### Added buy, build, outsource


## [0.7.0]

### Added inertia to Components
### Added some new Wardley Map components based upon a tweet (https://twitter.com/swardley/status/1565744194475499521)
### Added Market
### Fixed documentation of labels.

## [0.6.0]

### Adding style wardley
### diverging from onlinewardleymaps, adding a group

This is a typical group:
```
group first [0.605, 0.85, 20, 50] yellow black
```
The idea is that you can add ovals with various colours to group things together.
Overlapping ovals (without a distinct border) should be able to create any required
grouping.
### Added some documentation.

## [0.5.0]

### Now supports title
### Also supports note
### Now has annotations
### and the annotation details

## [0.4.1]

### Now all existing components are compatible with onlinewardleymaps syntax

## [0.4.0]

### Added unit tests
### Added a changelog
### Added the ability to define offsets as per onlinewardleymap.com

This allows things like:
`component Kettle [0.43, 0.35] label [-57, 4]`

I have not yet solved the evolve parsing.

### Added alternative axis.
```
KinoWardley.Output.new("""
id myid8
height 400
width 800
title Tea Shop
anchor Business [0.95, 0.63]
anchor Public [0.95, 0.78]
component Cup of Tea [0.79, 0.61] label [19, -4]
component Cup [0.73, 0.78]
component Tea [0.63, 0.81]
component Hot Water [0.52, 0.80]
component Water [0.38, 0.82]
component Kettle [0.43, 0.35] label [-57, 4]
evolve Kettle [0.43, 0.62] label [16, 7]
component Power [0.1, 0.7] label [-27, 20]
evolve Power [0.1, 0.89] label [-12, 21]
Business->Cup of Tea
Public->Cup of Tea
Cup of Tea->Cup
Cup of Tea->Tea
Cup of Tea->Hot Water
Hot Water->Water
Hot Water->Kettle 
Kettle->Power
evolution Experiment->Prototype->Production->Product
""")
```

## [0.3.0] - 2022-09-03
### Improved parsing via regex.
### Internally split the js file out of the ex file.
