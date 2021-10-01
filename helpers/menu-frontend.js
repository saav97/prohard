const getMenuFrontEnd = (role = 'USER_ROLE')=>{
    const menu =  [
        {
          titulo: 'Mantenimiento',
          icono: 'mdi mdi-folder-lock-open',
          subMenu:[
            //{titulo: 'Usuarios', url: 'usuarios'},
            {titulo: 'Clientes', url:'clientes'},
            {titulo: 'Tickets', url:'tickets'},
          ]
        }
      ]

      if(role == 'ADMIN_ROLE'){
          menu[0].subMenu.unshift({titulo: 'Usuarios', url: 'usuarios'}),
          menu[0].subMenu.unshift({titulo: 'Tareas', url: 'tareas'})
      }

      return menu;
}

module.exports = {
    getMenuFrontEnd
}