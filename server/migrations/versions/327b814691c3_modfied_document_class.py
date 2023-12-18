"""modfied document class

Revision ID: 327b814691c3
Revises: 549235071aa2
Create Date: 2023-12-18 10:46:07.820232

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '327b814691c3'
down_revision = '549235071aa2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('documents', schema=None) as batch_op:
        batch_op.drop_column('verified')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('documents', schema=None) as batch_op:
        batch_op.add_column(sa.Column('verified', sa.BOOLEAN(), autoincrement=False, nullable=True))

    # ### end Alembic commands ###
