import { Layout, Input, BackTop } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';

import SideMenu from './SideMenu';
import { getDictcConfig } from 'ts/ext/config';

// mock data
import FakeContent from 'ts/components/mock/FakeContent';

const { Footer, Sider, Content } = Layout;
const { Search } = Input;

interface IContainerProps extends RouteComponentProps<IContainerProps> {
  children: React.ReactElement<any> | React.ReactElement<any>[];
}

interface IContainerState {
  collapsed: boolean;
  hasError: boolean;
  appTitle: string;
  appFooterText: string;
  menuTheme: 'light' | 'dark';
}

class Container extends React.Component<IContainerProps, IContainerState> {
  constructor (props: any) {
    super(props);
    this.state = {
      collapsed: false,
      hasError: false,
      appTitle: 'Documentation',
      appFooterText: 'Powered by dictc',
      menuTheme: 'dark',
    };
  }

  public async componentDidMount () {
    const dictcConfig = await getDictcConfig('basicConfig') || {};
    const appTitle = dictcConfig.title || 'Documentation';
    const appFooterText = dictcConfig.footerText || 'Powered by dictc';
    const menuTheme = dictcConfig.theme || 'dark';
    this.setState({appTitle, appFooterText, menuTheme});
  }

  public componentDidCatch (error: any, info: any) {
    if (process.env.NODE_ENV == 'development') {
      console.error('error caught from child element tree:', error);
      console.info('info got in `componentDidCatch`', info);
    }
    this.setState({hasError: true});
  }

  // recover from crashed page on route changing
  private onChangeMenu = (key: string) => {
    this.setState({hasError: false});
  }

  public render () {
    const { appTitle, appFooterText, menuTheme } = this.state;

    return (
      <Layout className="dictc-layout">
        <Sider className={`dictc-sider dictc-sider-${menuTheme}`}>
          <div className="dictc-sider-header">
            <h1 className={`dictc-sider-title dictc-sider-title-${menuTheme}`}>{appTitle}</h1>
            <Search
              placeholder="Search API"
              onChange={e => console.log(e.target.value)}
              style={{ width: 180 }}
            />
          </div>
          <SideMenu theme={menuTheme} />
        </Sider>
        <Layout className="dictc-right-layout">
          <Content className="dictc-content">
            <div className="content-paper">
              <BackTop />
              {/* <FakeContent /> */}
              {
                this.props.children
              }
            </div>
          </Content>
          <Footer className="dictc-footer">{appFooterText}</Footer>
        </Layout>
      </Layout>
    );
  }
}

// If you don't wrap Container with `withRouter`, router render will not work due to the connect function.
export default withRouter(Container);
