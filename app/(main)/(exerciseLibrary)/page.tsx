import ExCardsSection from "../_components/exercideLibrary/ExCardsSection";

const ExerciseLibraryPage = ({ params }: { params: { card: string } }) => {
  console.log(params);
  return (
    <div className="p-4 text-center text-xl">
      <ExCardsSection />
    </div>
  );
};

export default ExerciseLibraryPage;
