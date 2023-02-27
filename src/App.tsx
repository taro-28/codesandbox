import "./styles.css";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

let cache = { name: "taro", age: 27 };

const fetch = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return cache;
};

const mutate = async (data: typeof cache) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    throw new Error("aaa");
    cache = data;
    return cache;
  } catch {}
};

const useProfile = () => {
  const { data, isValidating } = useSWR("key", fetch, {});
  const { isMutating, trigger } = useSWRMutation(
    "key",
    async (_, { arg }: { arg: typeof cache }) => mutate(arg)
  );

  const _trigger = (data: typeof cache) =>
    trigger(data, {
      optimisticData: (current) => ({
        ...current,
        name: data.name,
        age: data.age
      })
    });

  return { data, isMutating, trigger: _trigger, isValidating };
};

const IsMutatingOnly = () => {
  const { isMutating, isValidating } = useProfile();
  console.log(`IsMutatingOnly rendered! isMutating=${isMutating}`);

  return (
    <div style={{ background: "yellow" }}>
      <h3>isMutating Only</h3>
      <p>{`isMutating = ${isMutating} isValidating = ${isValidating}`}</p>
    </div>
  );
};

const DataOnly = () => {
  const { data } = useProfile();
  console.log("DataOnly rendered!");

  return (
    <div style={{ background: "orange" }}>
      <h3>Data Only</h3>
      <p>{`name = ${data?.name}`}</p>
      <p>{`age = ${data?.age}`}</p>
    </div>
  );
};

const IsMutatingAndData = () => {
  const { data, isMutating } = useProfile();
  console.log(`IsMutatingAndData rendered! isMutating=${isMutating}`);

  return (
    <div style={{ background: "pink" }}>
      <h3>IsMutating And Data</h3>
      <p>{`isMutating = ${isMutating}`}</p>
      <p>{`name = ${data?.name}`}</p>
      <p>{`age = ${data?.age}`}</p>
    </div>
  );
};

const MutateButton = () => {
  const { trigger, isMutating } = useProfile();
  console.log(`MutateButton rendered! isMutating=${isMutating}`);

  return (
    <button onClick={() => trigger({ name: "jiro", age: 26 })}>
      {isMutating ? "Mutating..." : "Mutate"}
    </button>
  );
};

export default function App() {
  return (
    <div className="App">
      <IsMutatingOnly />
      <DataOnly />
      <IsMutatingAndData />
      <MutateButton />
    </div>
  );
}
