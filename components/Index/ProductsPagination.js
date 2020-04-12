import { useRouter } from 'next/router';
import { Container, Pagination, Icon } from 'semantic-ui-react';

function ProductPagination({ totalPages }) {
  const router = useRouter();

  const handPageChange = (event, data) => {
    if (data.activePage === 1) {
      router.push('/');
    } else {
      router.push(`/?page=${data.activePage}`);
    }
  };

  return (
    <Container textAlign="center" style={{ margin: '2em' }}>
      <Pagination
        defaultActivePage={1}
        totalPages={totalPages}
        onPageChange={handPageChange}
        ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
        firstItem={{ content: <Icon name="angle double left" />, icon: true }}
        lastItem={{ content: <Icon name="angle double right" />, icon: true }}
        prevItem={{ content: <Icon name="angle left" />, icon: true }}
        nextItem={{ content: <Icon name="angle right" />, icon: true }}
      />
    </Container>
  );
}

export default ProductPagination;
