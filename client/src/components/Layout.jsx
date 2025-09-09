import Header from './Header.jsx';
import ChatWidget from './ChatWidget.jsx';

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <ChatWidget />
    </div>
  );
}


