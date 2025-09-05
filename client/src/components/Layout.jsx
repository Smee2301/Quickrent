import Header from './Header.jsx';

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}


