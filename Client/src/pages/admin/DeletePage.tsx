import DOMPurify from "../../utils/santitizeConfig";
import CardWrapped from "../../components/admin/CardWrapped";

interface DeletePageProps<T extends { id: string | number }> {
  entityName: string;
  data: T;
  fields: { key: keyof T; label: string }[];
  imageKey?: keyof T;
  onDelete: (id: string | number) => void;
  onCancel: () => void;
}

function DeletePage<T extends { id: string | number }>({
  entityName,
  data,
  fields,
  imageKey,
  onDelete,
  onCancel,
}: DeletePageProps<T>) {
  return (
    <CardWrapped title="Advertisement Delete">
      <>
        <div className="card-header">
          <strong>Are you sure you want to delete this {entityName}?</strong>
        </div>

        <div className="card-body py-0">
          <div className="row">
            {/* Fields */}
            <div className="col-9">
              <table className="table">
                <tbody>
                  {fields.map((f) => (
                    <tr key={String(f.key)}>
                      <th>{f.label}</th>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(String(data[f.key] ?? "-")),
                        }}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Image (optional) */}
            {imageKey && (
              <div className="col-3 text-center">
                <strong>Image</strong>
                <br />
                <img
                  src={String(data[imageKey] ?? "")}
                  alt="Preview"
                  className="img-thumbnail image-delete"
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
            )}
          </div>
        </div>

        <div className="card-footer">
          <button
            type="button"
            className="btn btn-danger me-2"
            onClick={() => onDelete(data.id)}
          >
            <i className="fa-solid fa-trash fa-sm"></i> Delete
          </button>

          <button type="button" className="btn btn-success" onClick={onCancel}>
            <i className="fa-solid fa-right-from-bracket fa-rotate-180"></i> Back to List
          </button>
        </div>
      </>
    </CardWrapped>
  );
}

export default DeletePage;
