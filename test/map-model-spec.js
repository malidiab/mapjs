/*global beforeEach, content, describe, expect, it, jasmine, spyOn, MAPJS*/
describe('MapModel', function () {
	'use strict';
	it('should be able to instantiate MapModel', function () {
		var layoutCalculator,
			underTest = new MAPJS.MapModel(layoutCalculator);
		expect(underTest).not.toBeUndefined();
	});
	describe('events dispatched by MapModel when idea/layout is changed', function () {
		var underTest,
			anIdea,
			layoutBefore,
			layoutAfter;
		beforeEach(function () {
			var layoutCalculatorLayout,
				layoutCalculator = function () {
					return layoutCalculatorLayout;
				};
			layoutBefore = {
				nodes: {
					to_be_removed: {
						x: 10,
						y: 20,
						title: 'This node will be removed'
					},
					to_be_moved: {
						x: 50,
						y: 20,
						title: 'second'
					}
				}
			};
			layoutAfter = {
				nodes: {
					to_be_moved: {
						x: 49,
						y: 20,
						title: 'This node will be moved'
					},
					to_be_created: {
						x: 100,
						y: 200,
						title: 'This node will be created'
					}
				}
			};
			underTest = new MAPJS.MapModel(layoutCalculator);
			layoutCalculatorLayout = layoutBefore;
			anIdea = content({});
			underTest.setIdea(anIdea);
			layoutCalculatorLayout = layoutAfter;
		});
		it('should dispatch nodeCreated event when a node is created because idea is changed', function () {
			var nodeCreatedListener = jasmine.createSpy();
			underTest.addEventListener('nodeCreated', nodeCreatedListener);

			anIdea.dispatchEvent('changed', undefined);

			expect(nodeCreatedListener).toHaveBeenCalledWith(layoutAfter.nodes.to_be_created);
		});
		it('should dispatch nodeMoved event when a node is moved because idea is changed', function () {
			var nodeMovedListener = jasmine.createSpy();
			underTest.addEventListener('nodeMoved', nodeMovedListener);

			anIdea.dispatchEvent('changed', undefined);

			expect(nodeMovedListener).toHaveBeenCalledWith(layoutAfter.nodes.to_be_moved);
		});
		it('should dispatch nodeRemoved event when a node is removed because idea is changed', function () {
			var nodeRemovedListener = jasmine.createSpy();
			underTest.addEventListener('nodeRemoved', nodeRemovedListener);

			anIdea.dispatchEvent('changed', undefined);

			expect(nodeRemovedListener).toHaveBeenCalledWith(layoutBefore.nodes.to_be_removed);
		});
		it('should dispatch nodeSelectionChanged when a different node is selected', function () {
			var nodeSelectionChangedListener = jasmine.createSpy();
			underTest.addEventListener('nodeSelectionChanged', nodeSelectionChangedListener);

			underTest.selectNode(1);

			expect(nodeSelectionChangedListener).toHaveBeenCalledWith(1, true);
		});
		it('should dispatch nodeSelectionChanged when a different node is selected', function () {
			var nodeSelectionChangedListener = jasmine.createSpy();
			underTest.selectNode(1);
			underTest.addEventListener('nodeSelectionChanged', nodeSelectionChangedListener);

			underTest.selectNode(2);

			expect(nodeSelectionChangedListener).toHaveBeenCalledWith(1, false);
		});
		it('should dispatch nodeEditRequested when a request to edit node is made', function () {
			var nodeEditRequestedListener = jasmine.createSpy();
			underTest.addEventListener('nodeEditRequested:1', nodeEditRequestedListener);
			underTest.selectNode(1);

			underTest.editNode();

			expect(nodeEditRequestedListener).toHaveBeenCalledWith({});
		});
	});
	describe('methods delegating to idea', function () {
		var anIdea, underTest;
		beforeEach(function () {
			anIdea = content({});
			underTest = new MAPJS.MapModel(function () {
				return {
				};
			});
			underTest.setIdea(anIdea);
		});
		it('should invoke idea.addSubIdea with currently selected idea as parentId when addSubIdea method is invoked', function () {
			spyOn(anIdea, 'addSubIdea');
			underTest.selectNode(123);

			underTest.addSubIdea();

			expect(anIdea.addSubIdea).toHaveBeenCalledWith(123, 'double click to edit');
		});
		it('should invoke idea.removeSubIdea with currently selected idea as parentId when removeSubIdea method is invoked', function () {
			spyOn(anIdea, 'removeSubIdea');
			underTest.selectNode(321);

			underTest.removeSubIdea();

			expect(anIdea.removeSubIdea).toHaveBeenCalledWith(321);
		});
		it('should invoke idea.updateTitle with currently selected idea as ideaId when updateTitle method is invoked', function () {
			spyOn(anIdea, 'updateTitle');
			underTest.selectNode(111);

			underTest.updateTitle('new title');

			expect(anIdea.updateTitle).toHaveBeenCalledWith(111, 'new title');
		});
		it('should remove all the nodes from the map except the central one when map is cleared', function () {
			spyOn(anIdea, 'clear');

			underTest.clear();

			expect(anIdea.clear).toHaveBeenCalled();
		});
	});
});
