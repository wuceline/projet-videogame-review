<?php

namespace App\Http\Controllers;

use App\Models\Videogame;
use Illuminate\Http\Request;

class VideogameController extends Controller
{
    /**
     * /videogames/[id]
     * GET
     */
    public function read($id) {
        // Get item or send 404 response if not
        $item = Videogame::find($id);

        // Si on a un résultat
        if (!empty($item)) {
            // Return JSON of this list
            return $this->sendJsonResponse($item, 200);
        }
        // Sinon
        else {
            // HTTP status code 404 Not Found
            return $this->sendEmptyResponse(404);
        }
    }

    /**
     * /videogames/[id]/reviews
     * GET
     */
    public function getReviews($id) {
        // Get item or send 404 response if not
        $item = Videogame::find($id);

        // Si on a un résultat
        if (!empty($item)) {
            // Retrieve all related Reviews (thanks to Relationships)
            $reviews = $item->reviews->load(['videogame', 'platform']);
            // But, relationships with videogame & plaftorm are not configured yet
            $reviews = $item->reviews;


            // Return JSON of this list
            return $this->sendJsonResponse($reviews, 200);
        }
        // Sinon
        else {
            // HTTP status code 404 Not Found
            return $this->sendEmptyResponse(404);
        }
    }

    public function list() {

        $videogamesList = Videogame::all();

        return $this->sendJsonResponse($videogamesList,200);

    }

    public function post(Request $request){
        if ($request->filled(['name', 'editor'])) {
            $videogame = new Videogame();

            $videogame->name = $request->input('name');
            $videogame->editor = $request->input('editor');
            $videogame->status = 1;

            $isInserted = $videogame->save();
        }else{
            return response("",400);
        };

        if ($isInserted){
            return response()->json($videogame, 201);
        }else{
            return response()->json(['error'=>'Internal Server Error'], 500);
        };
    }
}
