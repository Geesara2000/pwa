<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SyncController extends Controller
{
    /**
     * Endpoint for reconciling offline activity.
     */
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'actions' => 'required|array',
            'actions.*.type' => 'required|string',
            'actions.*.payload' => 'required|array',
            'actions.*.timestamp' => 'required',
        ]);

        // In research, we log the actions to verify they were synchronized.
        Log::info('Offline Actions Synchronized:', $validated['actions']);

        return response()->json([
            'message' => 'Offline actions synchronized successfully',
            'count' => count($validated['actions'])
        ], 200);
    }
}
