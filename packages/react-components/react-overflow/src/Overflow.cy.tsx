import * as React from 'react';
import { mount } from '@cypress/react';
import {
  Overflow,
  OverflowItem,
  OverflowDivider,
  OverflowItemProps,
  OverflowProps,
  useIsOverflowGroupVisible,
  useOverflowMenu,
  useOverflowContext,
  useIsOverflowItemVisible,
} from '@fluentui/react-overflow';
import { Portal } from '@fluentui/react-portal';

const selectors = {
  container: 'data-test-container',
  item: 'data-test-item',
  divider: 'data-test-divider',
  menu: 'data-test-menu',
};

const Container: React.FC<{ children?: React.ReactNode; width?: number } & Omit<OverflowProps, 'children'>> = ({
  children,
  width,
  ...overflowProps
}) => {
  const selector = {
    [selectors.container]: '',
  };

  return (
    <Overflow padding={0} {...overflowProps}>
      <div
        {...selector}
        style={{
          width: width ?? 500,
          border: '1px dashed red',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          resize: 'horizontal',
        }}
      >
        {children}
      </div>
    </Overflow>
  );
};

const setContainerSize = (size: number) => {
  cy.get(`[${selectors.container}]`)
    .then(container => {
      container.css('width', `${size}px`);
    })
    .log(`Setting container size to ${size}px`)
    .wait(1);
};

const Item: React.FC<{ children?: React.ReactNode; width?: number } & Omit<OverflowItemProps, 'children'>> = ({
  children,
  width,
  ...overflowItemProps
}) => {
  const selector = {
    [selectors.item]: overflowItemProps.id,
  };

  return (
    <OverflowItem {...overflowItemProps}>
      <button {...selector} style={{ width: width ?? 50, height: 20 }}>
        {children}
      </button>
    </OverflowItem>
  );
};

const Menu: React.FC<{ width?: number }> = ({ width }) => {
  const { isOverflowing, ref, overflowCount } = useOverflowMenu<HTMLButtonElement>();
  const itemVisibility = useOverflowContext(ctx => ctx.itemVisibility);
  const selector = {
    [selectors.menu]: '',
  };

  if (!isOverflowing) {
    return null;
  }

  // No need to actually render a menu, we're testing state
  return (
    <>
      <button {...selector} ref={ref} style={{ width: width ?? 50, height: 20 }}>
        +{overflowCount}
      </button>
      <Portal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            width: 200,
            position: 'fixed',
            bottom: 0,
            right: 0,
            border: '2px dotted magenta',
          }}
        >
          {Object.entries(itemVisibility).map(([id, visible]) => (
            <>
              <div>{id}</div>
              <div id={`${id}-visibility`}>{visible ? 'visible' : 'invisible'}</div>
            </>
          ))}
        </div>
      </Portal>
    </>
  );
};

export const Divider: React.FC<{
  groupId: string;
  children?: React.ReactNode;
}> = ({ groupId, children }) => {
  const isGroupVisible = useIsOverflowGroupVisible(groupId);

  if (isGroupVisible === 'hidden') {
    return null;
  }

  const styles = {
    outer: {
      display: 'inline-block',
      paddingBottom: '0px',
      height: '20px',
    },

    inner: {
      width: '2px',
      backgroundColor: 'green',
      height: '100%',
    },
  };

  const selector = {
    [selectors.divider]: groupId,
  };

  return (
    <div {...selector} style={styles.outer}>
      <div style={styles.inner} />
      {children}
    </div>
  );
};

export const CustomDivider: React.FC<{
  groupId: string;
  children?: React.ReactNode;
}> = ({ groupId, children }) => {
  const isGroupVisible = useIsOverflowGroupVisible(groupId);

  if (isGroupVisible === 'hidden') {
    return null;
  }

  const selector = {
    [selectors.divider]: groupId,
  };

  const style = {
    display: 'inline-block',
    width: '30px',
    backgroundColor: 'red',
    height: '20px',
  };

  return (
    <OverflowDivider groupId={groupId}>
      <div {...selector} style={style}>
        {children}
      </div>
    </OverflowDivider>
  );
};

describe('Overflow', () => {
  before(() => {
    cy.viewport(700, 700);
  });

  it('should not overflow when there is enough space', () => {
    const mapHelper = new Array(10).fill(0).map((_, i) => i);
    mount(
      <Container>
        {mapHelper.map(i => (
          <Item key={i} id={i.toString()}>
            {i}
          </Item>
        ))}
        <Menu />
      </Container>,
    );

    setContainerSize(500);
    cy.get(`[${selectors.menu}]`).should('not.exist');
  });

  it(`should overflow items`, () => {
    const mapHelper = new Array(10).fill(0).map((_, i) => i);
    mount(
      <Container>
        {mapHelper.map(i => (
          <Item key={i} id={i.toString()}>
            {i}
          </Item>
        ))}
        <Menu />
      </Container>,
    );
    const overflowCases = [
      { containerSize: 450, overflowCount: 2 },
      { containerSize: 400, overflowCount: 3 },
      { containerSize: 350, overflowCount: 4 },
      { containerSize: 300, overflowCount: 5 },
      { containerSize: 250, overflowCount: 6 },
      { containerSize: 200, overflowCount: 7 },
      { containerSize: 150, overflowCount: 8 },
      { containerSize: 100, overflowCount: 9 },
      { containerSize: 50, overflowCount: 10 },
    ];

    overflowCases.forEach(({ overflowCount, containerSize }) => {
      setContainerSize(containerSize);
      cy.get(`[${selectors.menu}]`).should('have.text', `+${overflowCount}`);
    });
  });

  it(`should overflow items when there's more than one child element`, () => {
    const mapHelper = new Array(10).fill(0).map((_, i) => i);
    const overflowElementIndex = 6;
    mount(
      <Container width={350}>
        <div>
          {mapHelper.map(i => (
            <Item key={i} id={i.toString()}>
              {i}
            </Item>
          ))}
          <Menu />
        </div>
      </Container>,
    );

    cy.get(`[${selectors.item}]`).each((value, index) => {
      if (index >= overflowElementIndex) {
        expect(Cypress.$(value).css('display')).to.equal('none');
      } else {
        expect(Cypress.$(value).css('display')).to.equal('inline-block');
      }
    });
  });

  it(`should overflow items in reverse order`, () => {
    const mapHelper = new Array(10).fill(0).map((_, i) => i);
    mount(
      <Container overflowDirection="start">
        <Menu />
        {mapHelper.map(i => (
          <Item key={i} id={i.toString()}>
            {i}
          </Item>
        ))}
      </Container>,
    );
    const overflowCases = [
      { containerSize: 450, latestOverflowed: 1 },
      { containerSize: 400, latestOverflowed: 2 },
      { containerSize: 350, latestOverflowed: 3 },
      { containerSize: 300, latestOverflowed: 4 },
      { containerSize: 250, latestOverflowed: 5 },
      { containerSize: 200, latestOverflowed: 6 },
      { containerSize: 150, latestOverflowed: 7 },
      { containerSize: 100, latestOverflowed: 8 },
      { containerSize: 50, latestOverflowed: 9 },
    ];

    overflowCases.forEach(({ containerSize, latestOverflowed }) => {
      setContainerSize(containerSize);
      cy.get(`[${selectors.item}=${latestOverflowed}]`).should('not.be.visible');
    });
  });

  it('should overflow based on priority', () => {
    const priorities = [0, 1, 4, 6, 2, 5, 3, 9, 8, 7];
    mount(
      <Container>
        {priorities.map(i => (
          <Item key={i} id={i.toString()} priority={i}>
            {i}
          </Item>
        ))}
        <Menu />
      </Container>,
    );

    const overflowCases = [
      { containerSize: 450, latestOverflowed: 1 },
      { containerSize: 400, latestOverflowed: 2 },
      { containerSize: 350, latestOverflowed: 3 },
      { containerSize: 300, latestOverflowed: 4 },
      { containerSize: 250, latestOverflowed: 5 },
      { containerSize: 200, latestOverflowed: 6 },
      { containerSize: 150, latestOverflowed: 7 },
      { containerSize: 100, latestOverflowed: 8 },
      { containerSize: 50, latestOverflowed: 9 },
    ];

    overflowCases.forEach(({ containerSize, latestOverflowed }) => {
      setContainerSize(containerSize);
      cy.get(`[${selectors.item}=${latestOverflowed}]`).should('not.be.visible');
    });
  });

  it(`should expand items`, () => {
    const mapHelper = new Array(10).fill(0).map((_, i) => i);
    mount(
      <Container>
        {mapHelper.map(i => (
          <Item key={i} id={i.toString()}>
            {i}
          </Item>
        ))}
        <Menu />
      </Container>,
    );
    const overflowCases = [
      { containerSize: 50, overflowCount: 10 },
      { containerSize: 100, overflowCount: 9 },
      { containerSize: 150, overflowCount: 8 },
      { containerSize: 200, overflowCount: 7 },
      { containerSize: 250, overflowCount: 6 },
      { containerSize: 300, overflowCount: 5 },
      { containerSize: 350, overflowCount: 4 },
      { containerSize: 400, overflowCount: 3 },
      { containerSize: 450, overflowCount: 2 },
    ];

    overflowCases.forEach(({ overflowCount, containerSize }) => {
      setContainerSize(containerSize);
      cy.get(`[${selectors.menu}]`).should('have.text', `+${overflowCount}`);
    });
  });

  it(`should expand items in reverse order`, () => {
    const mapHelper = new Array(10).fill(0).map((_, i) => i);
    mount(
      <Container overflowDirection="start">
        <Menu />
        {mapHelper.map(i => (
          <Item key={i} id={i.toString()}>
            {i}
          </Item>
        ))}
      </Container>,
    );
    const overflowCases = [
      { containerSize: 100, latestOverflowed: 9 },
      { containerSize: 150, latestOverflowed: 8 },
      { containerSize: 200, latestOverflowed: 7 },
      { containerSize: 250, latestOverflowed: 6 },
      { containerSize: 300, latestOverflowed: 5 },
      { containerSize: 350, latestOverflowed: 4 },
      { containerSize: 400, latestOverflowed: 3 },
      { containerSize: 450, latestOverflowed: 2 },
    ];

    overflowCases.forEach(({ containerSize, latestOverflowed }) => {
      setContainerSize(containerSize);
      cy.get(`[${selectors.item}=${latestOverflowed}]`).should('be.visible');
    });
  });

  it('should expand items based on priority', () => {
    const priorities = [0, 1, 4, 6, 2, 5, 3, 9, 8, 7];
    mount(
      <Container>
        {priorities.map(i => (
          <Item key={i} id={i.toString()} priority={i}>
            {i}
          </Item>
        ))}
        <Menu />
      </Container>,
    );

    const overflowCases = [
      { containerSize: 100, latestOverflowed: 9 },
      { containerSize: 150, latestOverflowed: 8 },
      { containerSize: 200, latestOverflowed: 7 },
      { containerSize: 250, latestOverflowed: 6 },
      { containerSize: 300, latestOverflowed: 5 },
      { containerSize: 350, latestOverflowed: 4 },
      { containerSize: 400, latestOverflowed: 3 },
      { containerSize: 450, latestOverflowed: 2 },
    ];

    overflowCases.forEach(({ containerSize, latestOverflowed }) => {
      setContainerSize(containerSize);
      cy.get(`[${selectors.item}=${latestOverflowed}]`).should('be.visible');
    });
  });

  it('should react to priority changes within the container', () => {
    const Example = () => {
      const [selected, setSelelected] = React.useState(0);
      return (
        <>
          <Container>
            {mapHelper.map(i => (
              <Item key={i} id={i.toString()} priority={selected === i ? 1000 : 0}>
                <span onClick={() => setSelelected(i)} style={{ color: selected === i ? 'red' : 'black' }}>
                  {i}
                </span>
              </Item>
            ))}
            <Menu />
          </Container>
          <div>
            <button id="select-9" onClick={() => setSelelected(9)}>
              Select 9
            </button>
          </div>
        </>
      );
    };

    const mapHelper = new Array(10).fill(0).map((_, i) => i);
    mount(<Example />);

    cy.get(`[${selectors.item}="3"]`).click();
    setContainerSize(150);
    cy.get(`[${selectors.item}="3"]`).should('be.visible');
    cy.get('#select-9').click();
    cy.get(`[${selectors.item}="9"]`).should('be.visible');
    cy.get(`[${selectors.item}="2"]`).should('not.be.visible');
  });

  it('should notify group visibility changes correctly', () => {
    mount(
      <Container padding={8}>
        <Item id={'6'} priority={6} groupId={'1'}>
          6-1
        </Item>
        <Divider groupId={'1'}>
          <span data-divider="1" />
        </Divider>
        <Item id={'7'} priority={7} groupId={'2'}>
          7-2
        </Item>
        <Divider groupId={'2'} data-divider="2">
          <span data-divider="2" />
        </Divider>
        <Item id={'4'} priority={4} groupId={'3'}>
          4-3
        </Item>
        <Item id={'5'} priority={5} groupId={'3'}>
          5-3
        </Item>
        <Divider groupId={'3'} data-divider="3">
          <span data-divider="3" />
        </Divider>
        <Item id={'1'} priority={1} groupId={'4'}>
          1-4
        </Item>
        <Item id={'2'} priority={2} groupId={'4'}>
          2-4
        </Item>
        <Item id={'3'} priority={3} groupId={'4'}>
          3-4
        </Item>
        <Divider groupId={'4'} data-divider="4">
          <span data-divider="4" />
        </Divider>
        <Item id={'8'} priority={8} groupId={'5'}>
          8-5
        </Item>
        <Menu />
      </Container>,
    );

    setContainerSize(350);
    cy.get(`[${selectors.divider}="4"]`).should('not.exist');
    cy.get(`[${selectors.divider}]`).should('have.length', 3);
    setContainerSize(250);
    cy.get(`[${selectors.divider}="3"]`).should('not.exist');
    cy.get(`[${selectors.divider}]`).should('have.length', 2);
    setContainerSize(200);
    cy.get(`[${selectors.divider}="1"]`).should('not.exist');
    cy.get(`[${selectors.divider}]`).should('have.length', 1);
  });

  it('should collapse correctly with custom divider', () => {
    mount(
      <Container padding={8}>
        <Item id={'1'} groupId={'1'}>
          1
        </Item>
        <CustomDivider groupId={'1'} data-divider="2">
          <span data-divider="2" />
        </CustomDivider>
        <Item id={'2'} groupId={'2'}>
          2
        </Item>
        <CustomDivider groupId={'2'} data-divider="2">
          <span data-divider="2" />
        </CustomDivider>
        <Item id={'3'} groupId={'3'}>
          3
        </Item>
        <Item id={'4'} groupId={'3'}>
          4
        </Item>
        <CustomDivider groupId={'3'} data-divider="3">
          <span data-divider="3" />
        </CustomDivider>
        <Item id={'5'} groupId={'4'}>
          5
        </Item>
        <Item id={'6'} groupId={'4'}>
          6
        </Item>
        <Item id={'7'} groupId={'4'}>
          7
        </Item>
        <CustomDivider groupId={'4'} data-divider="4">
          <span data-divider="4" />
        </CustomDivider>
        <Item id={'8'} groupId={'5'}>
          8
        </Item>
        <Menu />
      </Container>,
    );

    cy.get(`[${selectors.item}="8"]`).should('not.be.visible');
    setContainerSize(350);
    cy.get(`[${selectors.divider}="4"]`).should('not.exist');
    cy.get(`[${selectors.divider}]`).should('have.length', 3);
    cy.get(`[${selectors.item}="5"]`).should('not.be.visible');
    setContainerSize(250);
    cy.get(`[${selectors.divider}="3"]`).should('not.exist');
    cy.get(`[${selectors.divider}]`).should('have.length', 2);
    cy.get(`[${selectors.item}="3"]`).should('not.be.visible');
    setContainerSize(200);
    cy.get(`[${selectors.divider}="1"]`).should('exist');
    cy.get(`[${selectors.divider}]`).should('have.length', 1);
    cy.get(`[${selectors.item}="1"]`).should('be.visible');
    cy.get(`[${selectors.item}="2"]`).should('not.be.visible');
  });

  it('should remove overflow menu if the last overflowed item can take its place', () => {
    const mapHelper = new Array(10).fill(0).map((_, i) => i);
    mount(
      <Container>
        {mapHelper.map(i => (
          <Item key={i} id={i.toString()}>
            {i}
          </Item>
        ))}
        <Menu />
      </Container>,
    );

    setContainerSize(497);
    setContainerSize(498);
    setContainerSize(499);
    setContainerSize(500);
    cy.get(`[${selectors.menu}]`).should('not.exist');
  });

  it('should start overflowing once minimum visible items is reached', () => {
    const mapHelper = new Array(10).fill(0).map((_, i) => i);
    mount(
      <Container minimumVisible={5}>
        {mapHelper.map(i => (
          <Item key={i} id={i.toString()}>
            {i}
          </Item>
        ))}
        <Menu />
      </Container>,
    );

    setContainerSize(195);
    cy.get(`[${selectors.menu}]`).should('not.be.visible');
    cy.get(`[${selectors.item}="4"]`).should('not.be.visible');
  });

  // Container will fit 4 items with width 100 and the overflow menu
  // Once the priority of the foo item is updated it should have more
  // priority than Item 5 (width 100 item), so the foo item should be visible
  // once this foo item is visible, make sure that the subscriber is in sync.
  it('should dispatch update when updating priority of an item', () => {
    const Example = () => {
      const [priority, setPriority] = React.useState<number | undefined>();

      return (
        <>
          <Container>
            <Item id="1" width={100}>
              Item 1
            </Item>
            <Item id="2" width={100}>
              Item 2
            </Item>
            <Item id="3" width={100}>
              Item 3
            </Item>
            <Item id="4" width={100}>
              Item 4
            </Item>
            <Item id="5" width={100}>
              Item 5
            </Item>
            <Item id="foo" width={50} priority={priority}>
              Foo
            </Item>
            <Item id="7" width={50}>
              Item
            </Item>
            <Item id="8" width={50}>
              Item
            </Item>
            <Menu width={32} />
          </Container>
          <button onClick={() => setPriority(2)}>Update priority</button>
        </>
      );
    };
    mount(<Example />);

    setContainerSize(500);
    cy.contains('Update priority').click().get('#foo-visibility').should('have.text', 'visible');
  });

  it('Should have correct initial visibility state', () => {
    const mapHelper = new Array(10).fill(0).map((_, i) => i);
    const Assert = () => {
      const isVisible = mapHelper.map(i => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useIsOverflowItemVisible(i.toString());
      });

      if (isVisible.every(x => x)) {
        return <span data-passed="true" />;
      }

      return null;
    };

    mount(
      <Container minimumVisible={5}>
        {mapHelper.map(i => (
          <Item key={i} id={i.toString()}>
            {i}
          </Item>
        ))}
        <Menu />
        <Assert />
      </Container>,
    );

    setContainerSize(500);
    cy.get('[data-passed="true"]').should('exist');
  });
});
