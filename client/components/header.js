import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && {label: 'Sign In', href: '/auth/signin'},
    !currentUser && {label: 'Sign Up', href: '/auth/signup'},
    currentUser && {label: 'Sign Out', href: '/auth/signout'},
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return <li key={href} className='nav-item'>
        <Link href={href} className='nav-link text-decoration-none'>
          {label}
        </Link>
      </li>
    });

  return <nav className='navbar navbar-light bg-light p-3'>
    <Link href='/' className='text-decoration-none'>
      <div className='navbar-brand'>GitTix</div>
    </Link>

    <div className='d-flex justify-content-end'>
      <ul className='nav d-flex align-content-center'>
        {links}
      </ul>
    </div>
  </nav>
};

export default Header;
