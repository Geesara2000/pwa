<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Simulate adding a product to the cart.
     */
    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // In a real app, this might be stored in the session or a cart table.
        // For research, we just return a success message.
        return response()->json([
            'message' => 'Product added to cart successfully',
            'item' => $validated
        ], 200);
    }
}
