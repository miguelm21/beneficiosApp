import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShrinkingSegmentHeader } from './shrinking-segment-header/shrinking-segment-header';
import { ExpandableHeader } from './expandable-header/expandable-header';
import { ExplandableHeader } from './explandable-header/explandable-header';
@NgModule({
	declarations: [ShrinkingSegmentHeader,
	ExpandableHeader,
    ExplandableHeader],
	schemas: [
	  CUSTOM_ELEMENTS_SCHEMA
	],
	imports: [],
	exports: [ShrinkingSegmentHeader,
	ExpandableHeader,
    ExplandableHeader]
})
export class ComponentsModule {}
