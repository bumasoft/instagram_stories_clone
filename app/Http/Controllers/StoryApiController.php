<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StoryApiController extends Controller
{

    public function newStory(Request $request)
    {
        if ($request->hasFile('media') && $request->file('media')->isValid()) {
            $request->file('media')->storeAs('public/userfiles', $request->get('file_name'));

            return ['result' => true];
        }

        return ['result' => false];
    }
}
