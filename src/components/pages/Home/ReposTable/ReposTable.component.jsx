import React from "react";
import { Link } from "react-router-dom";
import { Table } from "semantic-ui-react";

export const ReposTable = ({ data }) => {
  const renderTableRows = () => {
    return data.map((r) => (
      <Table.Row key={r.id}>
        <Table.Cell>
          <Link
            to={{
              pathname: `/repo/${r.name}`,
              state: r.owner,
            }}
          >
            {r.name}
          </Link>
        </Table.Cell>
        <Table.Cell>{r.stargazers_count}</Table.Cell>
        <Table.Cell>{r.forks_count}</Table.Cell>
        <Table.Cell>{r.watchers_count}</Table.Cell>
      </Table.Row>
    ));
  };

  return (
    <Table celled data-testid="repo-table">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Repository Name</Table.HeaderCell>
          <Table.HeaderCell>Stars</Table.HeaderCell>
          <Table.HeaderCell>Forks</Table.HeaderCell>
          <Table.HeaderCell>Watchers</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{renderTableRows()}</Table.Body>
    </Table>
  );
};
