/* @flow */

import './lib/testdom';
import assert from 'assert';
import sinon from 'sinon';
import React from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import DraggableList from '../src';
import DragHandle from '../src/DragHandle';

class TestTemplate extends React.Component {
  render() {
    const {item, dragHandle} = this.props;
    return dragHandle(<div className="item">{item.name}</div>);
  }
}

describe("DraggableList", function() {

  it("drag works", function() {
    this.slow();

    const onMoveEnd = sinon.spy();

    const list = [
      {name: 'caboose'},
      {name: 'tucker'},
      {name: 'church'},
      {name: 'simmons'},
      {name: 'sarge'},
      {name: 'grif'},
      {name: 'donut'}
    ];
    const root: DraggableList = (TestUtils.renderIntoDocument(
      <DraggableList
        itemKey="name"
        list={list}
        template={TestTemplate}
        onMoveEnd={onMoveEnd}
        />
    ): any);

    assert.deepEqual(
      TestUtils.scryRenderedComponentsWithType(root, TestTemplate)
        .map(e=>e.props.item),
      list
    );

    const renderedHandles = TestUtils.scryRenderedComponentsWithType(root, DragHandle);
    assert(!root.state.drag);
    renderedHandles[0]._onMouseDown({pageY: 500, preventDefault(){}});
    assert(root.state.drag);

    root._handleMouseMove({pageY: 600});
    const reorderedList = [
      {name: 'tucker'},
      {name: 'church'},
      {name: 'simmons'},
      {name: 'caboose'},
      {name: 'sarge'},
      {name: 'grif'},
      {name: 'donut'}
    ];
    assert.deepEqual(
      TestUtils.scryRenderedComponentsWithType(root, TestTemplate)
        .map(e=>e.props.item),
      reorderedList
    );

    root._handleMouseMove({pageY: 650});
    const reorderedList2 = [
      {name: 'tucker'},
      {name: 'church'},
      {name: 'simmons'},
      {name: 'sarge'},
      {name: 'caboose'},
      {name: 'grif'},
      {name: 'donut'}
    ];
    assert.deepEqual(
      TestUtils.scryRenderedComponentsWithType(root, TestTemplate)
        .map(e=>e.props.item),
      reorderedList2
    );

    assert(root.state.drag);
    assert(onMoveEnd.notCalled);
    root._handleMouseUp();
    assert(!root.state.drag);
    assert(onMoveEnd.calledOnce);

    assert.deepEqual(
      onMoveEnd.args[0],
      [reorderedList2, {name: 'caboose'}, 0, 4]
    );

    assert.deepEqual(
      TestUtils.scryRenderedComponentsWithType(root, TestTemplate)
        .map(e=>e.props.item),
      reorderedList2
    );
  });

  it("props reordered during drag works", function() {
    this.slow();

    const onMoveEnd = sinon.spy();

    const list = [
      {name: 'caboose'},
      {name: 'tucker'},
      {name: 'church'},
      {name: 'simmons'},
      {name: 'sarge'},
      {name: 'grif'},
      {name: 'donut'}
    ];
    const div = document.createElement('div');
    const root: DraggableList = (ReactDOM.render(
      <DraggableList
        itemKey="name"
        list={list}
        template={TestTemplate}
        onMoveEnd={onMoveEnd}
        />,
      div
    ): any);

    assert.deepEqual(
      TestUtils.scryRenderedComponentsWithType(root, TestTemplate)
        .map(e=>e.props.item),
      list
    );

    const renderedHandles = TestUtils.scryRenderedComponentsWithType(root, DragHandle);
    renderedHandles[0]._onMouseDown({pageY: 500, preventDefault(){}});

    const propReorderedList = [
      {name: 'tucker'},
      {name: 'church'},
      {name: 'simmons'},
      {name: 'sarge'},
      {name: 'grif'},
      {name: 'caboose', extra: 1},
      {name: 'donut'}
    ];
    ReactDOM.render(
      <DraggableList
        itemKey="name"
        list={propReorderedList}
        template={TestTemplate}
        onMoveEnd={onMoveEnd}
        />,
      div
    );

    root._handleMouseMove({pageY: 650});
    const reorderedList = [
      {name: 'tucker'},
      {name: 'church'},
      {name: 'simmons'},
      {name: 'sarge'},
      {name: 'caboose', extra: 1},
      {name: 'grif'},
      {name: 'donut'}
    ];
    assert.deepEqual(
      TestUtils.scryRenderedComponentsWithType(root, TestTemplate)
        .map(e=>e.props.item),
      reorderedList
    );

    assert(root.state.drag);
    assert(onMoveEnd.notCalled);
    root._handleMouseUp();
    assert(!root.state.drag);
    assert(onMoveEnd.calledOnce);

    assert.deepEqual(
      onMoveEnd.args[0],
      [reorderedList, {name: 'caboose', extra: 1}, 0, 4]
    );

    assert.deepEqual(
      TestUtils.scryRenderedComponentsWithType(root, TestTemplate)
        .map(e=>e.props.item),
      reorderedList
    );
  });

  it("item removed during drag works", function() {
    this.slow();

    const onMoveEnd = sinon.spy();

    const list = [
      {name: 'caboose'},
      {name: 'tucker'},
      {name: 'church'},
      {name: 'simmons'},
      {name: 'sarge'},
      {name: 'grif'},
      {name: 'donut'}
    ];
    const div = document.createElement('div');
    const root: DraggableList = (ReactDOM.render(
      <DraggableList
        itemKey="name"
        list={list}
        template={TestTemplate}
        onMoveEnd={onMoveEnd}
        />,
      div
    ): any);

    assert.deepEqual(
      TestUtils.scryRenderedComponentsWithType(root, TestTemplate)
        .map(e=>e.props.item),
      list
    );

    const renderedHandles = TestUtils.scryRenderedComponentsWithType(root, DragHandle);
    renderedHandles[0]._onMouseDown({pageY: 500, preventDefault(){}});

    const propReorderedList = [
      {name: 'tucker'},
      {name: 'church'},
      {name: 'simmons'},
      {name: 'sarge'},
      {name: 'grif', extra: 2},
      {name: 'donut'}
    ];
    ReactDOM.render(
      <DraggableList
        itemKey="name"
        list={propReorderedList}
        template={TestTemplate}
        onMoveEnd={onMoveEnd}
        />,
      div
    );

    root._handleMouseMove({pageY: 650});
    const reorderedList = [
      {name: 'tucker'},
      {name: 'church'},
      {name: 'simmons'},
      {name: 'sarge'},
      {name: 'grif', extra: 2},
      {name: 'donut'}
    ];
    assert.deepEqual(
      TestUtils.scryRenderedComponentsWithType(root, TestTemplate)
        .map(e=>e.props.item),
      reorderedList
    );

    assert(!root.state.drag);
    assert(onMoveEnd.notCalled);
    root._handleMouseUp();
    assert(!root.state.drag);
    assert(onMoveEnd.notCalled);

    assert.deepEqual(
      TestUtils.scryRenderedComponentsWithType(root, TestTemplate)
        .map(e=>e.props.item),
      reorderedList
    );
  });
});
