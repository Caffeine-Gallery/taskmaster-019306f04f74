export const idlFactory = ({ IDL }) => {
  const Todo = IDL.Record({
    'id' : IDL.Nat,
    'text' : IDL.Text,
    'completed' : IDL.Bool,
  });
  return IDL.Service({
    'addTodo' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'deleteTodo' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getTodos' : IDL.Func([], [IDL.Vec(Todo)], ['query']),
    'toggleTodo' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
