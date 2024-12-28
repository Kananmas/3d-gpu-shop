import { Product } from "../index.data";

export const createProductInfo = (productInfo = new Product()) => {
    return `
        <h1>${productInfo.name.toUpperCase()}</h1>
        <h3>CATEGORY: ${productInfo.type.toUpperCase()}</h3>

        <h4>ABOUT</h4>
        <p>Lorem ipsum odor amet, consectetuer adipiscing elit. Tempor in class dis hendrerit fames ligula fames. Proin lorem mus orci gravida neque magnis finibus consectetur. Class non tempor metus gravida taciti eros. Pulvinar sed himenaeos nec aliquet orci sit commodo magnis. Habitant sed praesent imperdiet dignissim iaculis habitasse justo tellus.

Lacinia inceptos sociosqu integer sed varius enim. Tempus viverra hendrerit faucibus dignissim posuere vulputate elementum luctus. Porttitor magnis laoreet nisi nunc posuere, varius ipsum dis viverra. In nisl ante; tincidunt sem scelerisque imperdiet. Condimentum habitasse magna felis integer proin. Odio lobortis vitae quis tellus sed, est ultricies aliquam. Et tristique eget auctor consectetur ridiculus dictumst id ipsum. Justo dis finibus vitae; auctor himenaeos penatibus. Congue interdum cras suscipit in lacinia tempus vulputate per.

Ornare faucibus finibus eleifend sit magnis eget nullam nulla libero. Mauris dolor egestas sit sodales tortor congue morbi. Duis id curae nec iaculis ridiculus mollis. Justo scelerisque urna vel nullam commodo lobortis curae convallis. Diam ligula iaculis condimentum egestas nam. Nullam tellus imperdiet ad, torquent duis orci? Sapien mauris aptent purus dictumst mattis.</p>

    `
}