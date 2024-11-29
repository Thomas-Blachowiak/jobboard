type User = {
    userId: string, // primary key
    photo: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: number,
    password?: string,
    // cv: {
    //     [title: string]: string // a un titre ajouter une description
    // }
}


type Company = {
    id: string, // primary key
    name: string,
    adminIds: string[], // ids of users with admin rights
    employeesIds: string[], // ids of all company employees
    offerIds: string[],
}

type Offer = {
    id: string, // primary key
    companyId: string,
    employeeId: string,
    title: string,
    description: string,
    aplicants: string[], // List of aplication ids 
}

type Application = {
    offer: string, // composite primary key
    user: string, // composite primary key
    message: string
    // CV will be loaded on putton press by looking up the user object
}


/**
 * API Routes :
 * 
 * CRUD user
 * when loged in :
 *  CRUD and own comapny
 * from company:
 *  CRUD Offer
 * from Offer CRUD application
 * 
 * following routes are get and accept filters
 * list companies -> Company[]
 * list offers -> Company[]
 * list applications -> Applications[]
 */