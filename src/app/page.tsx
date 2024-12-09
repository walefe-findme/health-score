import HealthTable from "../components/HealthTable";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <HealthTable />
      </div>
    </div>
  );
}
