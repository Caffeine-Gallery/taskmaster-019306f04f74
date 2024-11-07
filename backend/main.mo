import Array "mo:base/Array";
import Bool "mo:base/Bool";

import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
    private type Todo = {
        id: Nat;
        text: Text;
        completed: Bool;
    };

    private stable var nextId : Nat = 0;
    private stable var todosEntries : [(Nat, Todo)] = [];
    private var todos = HashMap.HashMap<Nat, Todo>(0, Nat.equal, Hash.hash);

    system func preupgrade() {
        todosEntries := Iter.toArray(todos.entries());
    };

    system func postupgrade() {
        todos := HashMap.fromIter<Nat, Todo>(todosEntries.vals(), 1, Nat.equal, Hash.hash);
    };

    public func addTodo(text : Text) : async Nat {
        let id = nextId;
        let todo : Todo = {
            id = id;
            text = text;
            completed = false;
        };
        todos.put(id, todo);
        nextId += 1;
        id
    };

    public query func getTodos() : async [Todo] {
        Iter.toArray(todos.vals())
    };

    public func toggleTodo(id : Nat) : async Bool {
        switch (todos.get(id)) {
            case (null) { false };
            case (?todo) {
                let updatedTodo : Todo = {
                    id = todo.id;
                    text = todo.text;
                    completed = not todo.completed;
                };
                todos.put(id, updatedTodo);
                true
            };
        };
    };

    public func deleteTodo(id : Nat) : async Bool {
        switch (todos.remove(id)) {
            case (null) { false };
            case (?_) { true };
        };
    };
};
