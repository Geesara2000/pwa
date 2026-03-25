<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 10, 500),
            'image_url' => 'https://picsum.photos/seed/' . rand(1, 1000) . '/400/300',
            'category' => $this->faker->randomElement(['Electronics', 'Clothing', 'Home', 'Books', 'Toys']),
            'stock' => $this->faker->numberBetween(0, 50),
        ];
    }
}
