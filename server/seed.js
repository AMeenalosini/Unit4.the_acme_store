const {
    client,
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts,
    createFavorite,
    fetchFavorites,
    destroyFavorite,
  } = require("./db");
  
  const seed = async () => {
    await client.connect();
  
    await createTables();
    console.log("tables created");
  
    const [alice, bob, charlie, macbook, iphone, airpods] = await Promise.all([
      createUser("alice", "passAlice123"),
      createUser("bob", "passBob456"),
      createUser("charlie", "passCharlie789"),
      createProduct("MacBook"),
      createProduct("iPhone"),
      createProduct("AirPods"),
    ]);
  
    console.log("users created");
    console.log(await fetchUsers());
  
    console.log("products created");
    console.log(await fetchProducts());
  
    const [user_product] = await Promise.all([
      createFavorite(alice.id, macbook.id),
      createFavorite(bob.id, iphone.id),
      createFavorite(charlie.id, airpods.id),
    ]);
  
    console.log("favorites created");
    console.log(await fetchFavorites(alice.id));
  
    await destroyFavorite(user_product.id, alice.id);
  
    console.log("after deleting favorite");
    console.log(await fetchFavorites(alice.id));
  
    await client.end();
  };
  
  seed();