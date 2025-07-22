import { notFound } from 'next/navigation';
import { getResidentById } from '@/mocks/care-board-data';
import { IndividualPointDetailPage } from '@/components/3_organisms/resident/individual-point-detail-page';

interface IndividualPointPageProps {
  params: Promise<{
    residentId: string;
    category: string;
  }>;
}

export default async function IndividualPointPage({ params }: IndividualPointPageProps) {
  const { residentId, category } = await params;
  const residentIdNum = Number.parseInt(residentId, 10);
  const resident = getResidentById(residentIdNum);

  if (!resident) {
    notFound();
  }

  // Decode the category parameter
  const decodedCategory = decodeURIComponent(category);

  // Find the individual point for this category
  const individualPoint = resident.individualPoints?.find(
    (point) => point.category === decodedCategory
  );

  if (!individualPoint) {
    notFound();
  }

  return (
    <IndividualPointDetailPage
      resident={resident}
      category={decodedCategory}
      individualPoint={individualPoint}
    />
  );
}