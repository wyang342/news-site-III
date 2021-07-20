import React, { Component } from 'react';
import { Navbar } from 'reactstrap';
import Sections from '../../config/Sections.json';

class AppNav extends Component {
    render() {
        const { handleNavClick } = this.props;

        return (
            <Navbar color="light">
                {Sections.map((section, index) =>
                    <a href="#" key={index + 1} onClick={() => handleNavClick(section.value)} >
                        {section.label} |
                    </a>
                )}
            </Navbar>
        )
    }
}

export default AppNav;


// Functional solution:
// function AppNav({ navItems, handleNavClick }) {
//   return (
//     <Navbar color="light">
//       {navItems.map((navItem) =>
//         <a href="#" onClick={() => handleNavClick( navItem.value )} >
//           { navItem.label } |
//         </a>
//       )}
//     </Navbar>
//   );
// }
