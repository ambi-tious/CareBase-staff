import { IndividualPointDetailPage } from '@/components/3_organisms/resident/individual-point-detail-page';
import { getResidentById } from '@/mocks/care-board-data';
import { notFound } from 'next/navigation';

interface IndividualPointPageProps {
  params: Promise<{
    residentId: string;
    category: string;
  }>;
  searchParams: Promise<{
    mode?: 'create' | 'edit';
  }>;
}

export default async function IndividualPointPage({
  params,
  searchParams,
}: IndividualPointPageProps) {
  const { residentId, category } = await params;
  const { mode } = await searchParams;
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

  const isNewCreation = mode === 'create';

  return (
    <IndividualPointDetailPage
      resident={resident}
      category={decodedCategory}
      individualPoint={individualPoint}
      isNewCreation={isNewCreation}
    />
  );
}
