// Copyright 2018 Matt<mr.chenyuqing@live.com>

import { Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import { withRouter, RouteComponentProps } from 'react-router';

import { getDictcConfig } from 'ts/ext/config';

const SubMenu = Menu.SubMenu;

interface ISideMenuProps extends RouteComponentProps<ISideMenuProps> {
  theme: 'light' | 'dark';
}

interface ISideMenuState {
  subMenus: JSX.Element[] | null;
  selectedKey: string;
}

class SideMenu extends React.Component<ISideMenuProps, ISideMenuState> {
  constructor (props: any) {
    super(props);
    this.state = {
      subMenus: null,
      selectedKey: '',
    };
  }

  public async componentDidMount () {
    const { history } = this.props;
    const pages = await getDictcConfig('pages');
    const fisrtItemName = pages && pages[0] && encodeURI(pages[0].name);
    this.setState({
      subMenus: this.renderMenus(pages),
      selectedKey: fisrtItemName,
    }, () => {
      history.replace('/' + fisrtItemName);
    });
  }

  private handleClick = (e: ClickParam) => {
    const { history } = this.props;
    // history.replace(e.key);
    // onChangeMenu && onChangeMenu(e.key);
    this.setState({
      selectedKey: e.key
    }, () => {
      const path = e.keyPath.reverse().join('/');
      history.push('/' + path);
    });
  }

  // TODO: add pages type
  private renderMenus = (pages: any[]) => {
    function go (pages: any[]) {
      const menuArr: JSX.Element[] = [];
      for (const page of pages) {
        if (!page.subPages) {
          menuArr.push(<Menu.Item key={encodeURI(page.name)}>{page.name}</Menu.Item>);
        } else {
          menuArr.push(
            <SubMenu key={encodeURI(page.name)} title={page.name}>
              {
                go(page.subPages)
              }
            </SubMenu>
          );
        }
      }

      return menuArr;
    }

    return go(pages);
  }

  // tslint:disable-next-line:member-ordering
  public render () {
    const { theme } = this.props;
    const { subMenus, selectedKey } = this.state;

    return (
      <Menu
        theme={theme}
        onClick={this.handleClick}
        mode="inline"
        selectedKeys={[selectedKey]}
      >
        {
          subMenus
        }
      </Menu>
    );
  }
}

export default withRouter(SideMenu);
