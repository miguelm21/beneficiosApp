var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShrinkingSegmentHeader } from './shrinking-segment-header/shrinking-segment-header';
import { ExpandableHeader } from './expandable-header/expandable-header';
import { ExplandableHeader } from './explandable-header/explandable-header';
var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        NgModule({
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
    ], ComponentsModule);
    return ComponentsModule;
}());
export { ComponentsModule };
//# sourceMappingURL=components.module.js.map