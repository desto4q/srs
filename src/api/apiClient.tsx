import type { TypedPocketBase } from "pocketbase-types";
import PocketBase from "pocketbase";
import { PocketBaseTS } from "pocketbase-ts";
export let pb = new PocketBaseTS("http://127.0.0.1:8090") as TypedPocketBase;
