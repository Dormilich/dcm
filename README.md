DCM - DSA Character Manager
===

An online resource for managing character sheets of the German Pen’n’Paper RPG DSA (Das Schwarze Auge / The Black Eye).

## Features

Character display, creation and editing, though no rules are enforced.

The character’s data are available in three different pages: 
* mundane character sheet (skills)
* magic character sheet (spells and rituals)
* ordained character sheet (liturgies)

## Installation

Install *Node.js*, *npm* and *MongoDB*, the remainder will be taken care of by *npm* when you build the dependencies.

For the character sheets to be of any use, you need to insert skills (Wege des Schwerts), spells (Liber Cantiones Deluxe), rituals (Wege der Zauberei) and liturgies (Wege der Götter / Liber Liturgium) manually into the DB using an Admin account. You may want to use the Control Panel of your MongoDB provider (or the MongoDB shell, if provided) to set the Admin user’s *isAdmin* property to *true*. Once such an user is set, he has access to the DB content editor UI.

## Copyright

DAS SCHWARZE AUGE, AVENTURIEN, DERE, MYRANOR, THARUN, UTHURIA and RIESLAND are registered trademarks of *Significant Fantasy Medienrechte GbR*.

## The MIT License (MIT)

Copyright (c) 2013 - 2014 Dormilich

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
