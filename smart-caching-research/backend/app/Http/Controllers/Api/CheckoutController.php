<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    /**
     * Process a simulated checkout.
     */
    public function process(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated) {
            $totalAmount = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $price = $product->price * $item['quantity'];
                $totalAmount += $price;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price
                ];
            }

            $order = Order::create([
                'total_amount' => $totalAmount,
                'status' => 'completed'
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id,
                'total' => $totalAmount
            ], 201);
        });
    }
}
