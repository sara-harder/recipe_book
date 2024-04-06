function createFlexTable (num_columns, data_length) {
    // determine the num of rows required based on num columns
    const num_rows = Math.ceil(data_length / num_columns)
    const row_idxs = []
    for (let i=0; i < num_rows; i+=num_columns) {
        // push the idx to slice from the data for each row
        row_idxs.push([i, i+num_columns])
    }

    // add one last row for remainders
    const i = data_length % num_columns
    if (i !== 0 && i !== data_length) {
        row_idxs.push([data_length-i, data_length])
    }

    return row_idxs
}

export {createFlexTable}