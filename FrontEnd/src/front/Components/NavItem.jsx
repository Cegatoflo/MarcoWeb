import '../Styles/SNavbar.css';

export function NavItem({ locate}) {
  const name = locate.toLowerCase();
  let direction;
  if (name === "home") {
    direction = "/menu";
  }else{
    direction = `/menu/${name}`;
  }

  return (
    <li><a href={direction}>{locate}</a></li>
  );
}

