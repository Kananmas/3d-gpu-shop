import { randomString } from "./utils/randomString";

export const productTypes = {
    GPU: 'gpu',
    CPU: 'cpu',
    POWER: 'power',
    MOTHERBOARD: 'motherboard',
    CASE : 'case',
    RAM : 'ram'
}

export class Product {
    name;
    id;
    price;
    photo;
    type;
}

export const products = []
const rx580 = new Product();

rx580.name = 'XFX rx580'
rx580.price = 23000000
rx580.type = productTypes.GPU
rx580.photo = '../textures/rx580-box.png'


for (let i = 0; i < 50; i++) {
    const item = { ...rx580, id: randomString() }
    products.push(item)
}

const ryzen3200g = new Product();

ryzen3200g.name = 'AMD Ryzen 3200g';
ryzen3200g.price = 1200000
ryzen3200g.type = productTypes.CPU
ryzen3200g.photo = '../textures/ryzen3200g.jpg'


for (let i = 0; i < 400; i++) {
    const item = { ...ryzen3200g, id: randomString() }
    products.push(item)
}

const b450 = new Product();

b450.name = 'asus B450';
b450.type = productTypes.MOTHERBOARD;
b450.price = 12000000
b450.photo = '../textures/b450.png'


for(let i = 0 ; i < 10; i++) {
    const item = {...b450 , id:randomString()}
    products.push(item)
}

const coolermaster = new Product();

coolermaster.type = productTypes.POWER;
coolermaster.name = 'coolermaster 750W Power Unit'
coolermaster.price = 6000000
coolermaster.photo = '../textures/coolermaster450w.png'


for(let i=0; i < 10; i++) {
    const item = {...coolermaster , id:randomString()}
    products.push(item)
}